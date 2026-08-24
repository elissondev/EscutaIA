import type { Conversation } from "./data";
import { frictions } from "./data";

export interface AiSettings {
  mode: "local" | "openai";
  apiKey: string;
  baseUrl: string;
  model: string;
}

/** Mesma forma dos itens do ANALYSIS_POOL — o store completa id/kind/sizeKB/date. */
export type ConversationBase = Omit<Conversation, "id" | "kind" | "sizeKB" | "date">;

const LS_KEY = "escuta:ai";

export const DEFAULT_AI: AiSettings = {
  mode: "local",
  apiKey: "",
  baseUrl: "https://api.openai.com/v1",
  model: "gpt-4o-mini",
};

export function loadAiSettings(): AiSettings {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return DEFAULT_AI;
    return { ...DEFAULT_AI, ...(JSON.parse(raw) as Partial<AiSettings>) };
  } catch {
    return DEFAULT_AI;
  }
}

export function saveAiSettings(s: AiSettings) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(s));
  } catch {
    /* quota */
  }
}

const FRICTION_REF = frictions
  .map((f) => `${f.id} = "${f.title}"`)
  .join("; ");

const SYSTEM_PROMPT = `Você é o motor de análise da Escuta, plataforma de inteligência sobre conversas de suporte de empresas brasileiras. Você recebe um item de atendimento (áudio transcrito, e-mail, chat ou documento) e devolve uma análise estruturada.

Pontos de fricção conhecidos da empresa (use o id em "frictionId" SOMENTE quando a conversa claramente se encaixar em um deles; caso contrário omita):
${FRICTION_REF}

Retorne APENAS um JSON válido (sem markdown, sem texto extra) com exatamente estas chaves:
{
  "title": "rótulo curto no formato 'Tipo — resumo', máx. 70 caracteres, pt-BR",
  "customer": "nome do cliente ou 'Cliente identificado' / 'Interno · Operações' se for documento interno",
  "channel": "um entre: WhatsApp, E-mail, Chat do site, Telefone, Instagram, ReclameAqui, Upload",
  "sentiment": "positivo" | "neutro" | "negativo",
  "tags": ["2 a 3 tags curtas em minúscula"],
  "summary": "resumo analítico em 2 frases, pt-BR, citando padrão/fricção quando houver",
  "excerpt": "1-2 frases literais e realistas da conversa, entre aspas, pt-BR",
  "frictionId": "id da fricção (f1..f5) ou omita a chave se não houver",
  "duration": "duração no formato '1min 42s' — inclua SOMENTE se o item for áudio"
}`;

export interface AiInput {
  kind: Conversation["kind"];
  name: string;
  sizeKB: number;
  file?: File | null;
}

const cleanBase = (url: string) => url.trim().replace(/\/+$/, "");

export async function transcribeAudio(file: File, s: AiSettings): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  form.append("model", "whisper-1");
  form.append("response_format", "text");
  form.append("language", "pt");
  const res = await fetch(`${cleanBase(s.baseUrl)}/audio/transcriptions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${s.apiKey.trim()}` },
    body: form,
  });
  if (!res.ok) throw new Error(`Whisper HTTP ${res.status}`);
  return (await res.text()).trim();
}

export async function analyzeWithLLM(input: AiInput, s: AiSettings): Promise<ConversationBase> {
  let context = `Tipo de item: ${input.kind}\nArquivo: ${input.name}`;
  if (input.kind === "audio" && input.file) {
    const transcript = await transcribeAudio(input.file, s);
    context += `\n\nTranscrição do áudio (Whisper):\n${transcript.slice(0, 6000)}`;
  }
  const res = await fetch(`${cleanBase(s.baseUrl)}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${s.apiKey.trim()}`,
    },
    body: JSON.stringify({
      model: s.model.trim() || DEFAULT_AI.model,
      temperature: 0.4,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: context },
      ],
    }),
  });
  if (!res.ok) throw new Error(`LLM HTTP ${res.status}`);
  const data = await res.json();
  const raw: string = data?.choices?.[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(raw.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim()) as Record<
    string,
    unknown
  >;
  return normalize(parsed, input);
}

const VALID_SENTIMENTS = ["positivo", "neutro", "negativo"] as const;
const VALID_CHANNELS = [
  "WhatsApp",
  "E-mail",
  "Chat do site",
  "Telefone",
  "Instagram",
  "ReclameAqui",
  "Upload",
] as const;

function normalize(p: Record<string, unknown>, input: AiInput): ConversationBase {
  const sentiment = VALID_SENTIMENTS.includes(p.sentiment as never)
    ? (p.sentiment as Conversation["sentiment"])
    : "neutro";
  const channel = VALID_CHANNELS.includes(p.channel as never)
    ? (p.channel as Conversation["channel"])
    : input.kind === "documento"
      ? "Upload"
      : "Chat do site";
  const frictionId =
    typeof p.frictionId === "string" && frictions.some((f) => f.id === p.frictionId)
      ? p.frictionId
      : undefined;
  const base: ConversationBase = {
    title: String(p.title || input.name).slice(0, 80),
    customer: String(p.customer || "Cliente identificado").slice(0, 60),
    channel,
    sentiment,
    tags: Array.isArray(p.tags) ? p.tags.slice(0, 3).map((t) => String(t).slice(0, 24)) : ["ia"],
    summary: String(p.summary || "Análise gerada pelo motor de IA."),
    excerpt: String(p.excerpt || p.summary || ""),
  };
  if (frictionId) base.frictionId = frictionId;
  if (input.kind === "audio" && typeof p.duration === "string") base.duration = p.duration;
  return base;
}

export async function testConnection(s: AiSettings): Promise<{ ok: boolean; message: string }> {
  try {
    const res = await fetch(`${cleanBase(s.baseUrl)}/models`, {
      headers: { Authorization: `Bearer ${s.apiKey.trim()}` },
    });
    if (res.ok) return { ok: true, message: "Conexão OK — chave aceita pelo provedor." };
    if (res.status === 401 || res.status === 403)
      return { ok: false, message: `Chave recusada pelo provedor (HTTP ${res.status}).` };
    return { ok: false, message: `Provedor respondeu HTTP ${res.status}.` };
  } catch {
    return { ok: false, message: "Falha de rede/CORS — confira a URL base do provedor." };
  }
}
