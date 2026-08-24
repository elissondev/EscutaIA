import { useRef, useState } from "react";
import { useApp } from "../lib/store";
import { KIND_META, STAGES, frictions } from "../lib/data";
import type { AnalysisJob, Conversation } from "../lib/data";
import { Btn, Card, Chip, EmptyState, KindIcon, LockedNote, ProgressBar, SectionHead, SentimentChip } from "./ui";
import { IconArrowRight, IconCheck, IconLock, IconMic, IconUpload, IconWave } from "./icons";

function stageIndex(progress: number) {
  return Math.min(STAGES.length - 1, Math.floor((progress / 100) * STAGES.length));
}

function JobCard({ job, result }: { job: AnalysisJob; result: Conversation | undefined }) {
  const idx = stageIndex(job.progress);
  const done = job.progress >= 100;
  const friction = result?.frictionId ? frictions.find((f) => f.id === result.frictionId) : undefined;

  return (
    <Card className={`p-4 transition-all duration-300 ${done ? "border-pine-200 bg-pine-50/50" : ""}`}>
      <div className="flex items-center gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
            done ? "bg-pine-700 text-lime-300" : "bg-pine-950 text-lime-400"
          }`}
        >
          <KindIcon kind={job.kind} className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-[13.5px] font-semibold text-ink">{job.name}</p>
            <Chip tone="neutral" className="tnum">{job.sizeKB} KB</Chip>
            <Chip tone="neutral">{KIND_META[job.kind].label}</Chip>
          </div>
          {!done && (
            <p className="mt-0.5 flex items-center gap-1.5 text-[12px] text-ink-mute">
              <span className="h-1.5 w-1.5 rounded-full bg-lime-500 animate-pulse-dot" />
              {STAGES[idx]}…
            </p>
          )}
          {done && result && (
            <p className="mt-0.5 flex items-center gap-1.5 text-[12px] font-medium text-pine-600">
              <IconCheck className="h-3.5 w-3.5" /> Análise concluída — 6 etapas do pipeline
            </p>
          )}
        </div>
        <span className={`font-mono text-[12px] font-bold tnum ${done ? "text-pine-600" : "text-honey-600"}`}>
          {Math.round(job.progress)}%
        </span>
      </div>

      {!done && (
        <div className="mt-3">
          <ProgressBar value={job.progress} />
          <div className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-3">
            {STAGES.map((s, i) => (
              <p
                key={s}
                className={`flex items-center gap-1.5 text-[11px] transition-colors ${
                  i < idx ? "text-pine-600" : i === idx ? "font-semibold text-ink" : "text-ink-mute/60"
                }`}
              >
                {i < idx ? (
                  <IconCheck className="h-3 w-3 shrink-0 text-pine-500" />
                ) : (
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${i === idx ? "bg-lime-500 animate-pulse-dot" : "bg-line"}`} />
                )}
                {s}
              </p>
            ))}
          </div>
        </div>
      )}

      {done && result && (
        <div className="mt-3 animate-fade-up rounded-lg border border-pine-200 bg-card p-3.5">
          <div className="flex flex-wrap items-center gap-2">
            <SentimentChip s={result.sentiment} />
            {result.tags.map((t) => (
              <Chip key={t} tone="neutral">#{t}</Chip>
            ))}
            {friction && <Chip tone="coral">fricção: {friction.category}</Chip>}
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{result.summary}</p>
        </div>
      )}
    </Card>
  );
}

export default function UploadPage() {
  const { jobs, conversations, submitFiles, submitSamples, permissions, setRoute } = useApp();
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!permissions.canUpload) {
    return (
      <div className="space-y-4">
        <LockedNote
          title="Seu papel é somente visualização"
          desc="Contas de Visualização podem ver dashboards e insights, mas não enviam arquivos. Peça a um Administrador para elevar seu nível em Equipe."
        />
        <EmptyState
          icon={<IconLock className="h-6 w-6" />}
          title="Envio de arquivos bloqueado"
          desc="O pipeline de análise aceita áudios, e-mails, chats e documentos enviados por Administradores e Analistas."
          action={<Btn variant="outline" onClick={() => setRoute("insights")}>Ver insights da IA</Btn>}
        />
      </div>
    );
  }

  const onFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    submitFiles(
      Array.from(files).map((f) => ({
        name: f.name,
        sizeKB: Math.max(1, Math.round(f.size / 1024)),
      }))
    );
    if (inputRef.current) inputRef.current.value = "";
  };

  const activeJobs = jobs;
  const recentResults = conversations
    .filter((c) => Date.now() - new Date(c.date).getTime() < 15 * 60_000)
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* dropzone */}
        <div className="xl:col-span-2">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              onFiles(e.dataTransfer.files);
            }}
            onClick={() => inputRef.current?.click()}
            className={`group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition-all duration-200 ${
              dragging
                ? "scale-[1.01] border-lime-500 bg-lime-300/25 shadow-lift"
                : "border-pine-200 bg-card hover:border-pine-400 hover:bg-pine-50/60"
            }`}
          >
            <span
              className={`flex h-14 w-14 items-center justify-center rounded-xl transition-all duration-200 ${
                dragging ? "bg-lime-400 text-pine-950 scale-110" : "bg-pine-950 text-lime-400 group-hover:scale-105"
              }`}
            >
              <IconUpload className="h-7 w-7" />
            </span>
            <h3 className="mt-4 font-display text-lg font-bold text-ink">
              {dragging ? "Solte para analisar" : "Arraste os arquivos do seu suporte"}
            </h3>
            <p className="mt-1 max-w-md text-[13.5px] text-ink-mute">
              Ou <span className="font-semibold text-pine-600 underline decoration-lime-400 decoration-2 underline-offset-2">clique para escolher</span>. A IA
              transcreve áudios, lê e-mails e chats, cruza com o histórico e devolve diagnóstico.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {(Object.keys(KIND_META) as (keyof typeof KIND_META)[]).map((k) => (
                <Chip key={k} tone="pine" className="px-3 py-1">
                  <KindIcon kind={k} className="h-3.5 w-3.5" />
                  {KIND_META[k].label} · .{KIND_META[k].exts.slice(0, 3).join(" .")}
                </Chip>
              ))}
            </div>
            <input
              ref={inputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => onFiles(e.target.files)}
            />
          </div>

          {/* exemplos */}
          <Card className="mt-4 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-[13px] font-semibold text-ink">Sem arquivos por perto?</p>
                <p className="text-[12px] text-ink-mute">Dispare um lote de exemplo e veja o pipeline rodando.</p>
              </div>
              <Btn variant="lime" size="sm" onClick={submitSamples}>
                <IconWave className="h-4 w-4" /> Analisar 4 exemplos
              </Btn>
            </div>
          </Card>
        </div>

        {/* como funciona */}
        <Card className="p-5">
          <SectionHead eyebrow="Pipeline" title="Como a IA analisa" />
          <ol className="mt-4 space-y-3">
            {STAGES.map((s, i) => (
              <li key={s} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pine-800 font-mono text-[10.5px] font-bold text-lime-300">
                  {i + 1}
                </span>
                <div className="pt-0.5">
                  <p className="text-[13px] font-semibold leading-tight text-ink">{s}</p>
                  <p className="text-[11.5px] text-ink-mute">
                    {i === 0 && "Upload seguro com deduplicação automática."}
                    {i === 1 && "Transcrição de áudio (whisper) e parsing de e-mail/documento."}
                    {i === 2 && "Clusterização por tema contra o histórico da empresa."}
                    {i === 3 && "Tom, urgência e linguagem de churn em cada trecho."}
                    {i === 4 && "Match com fricções conhecidas e criação de novas hipóteses."}
                    {i === 5 && "Métricas atualizadas no dashboard em tempo real."}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-5 rounded-lg bg-pine-950 p-4 text-paper">
            <p className="flex items-center gap-2 text-[12px] font-semibold text-lime-300">
              <IconMic className="h-4 w-4" /> Dica
            </p>
            <p className="mt-1 text-[12px] leading-relaxed text-pine-200">
              Áudios de WhatsApp com mais de 2 minutos são segmentados por assunto antes da análise — cada assunto vira um insight independente.
            </p>
          </div>
        </Card>
      </div>

      {/* fila */}
      <div>
        <SectionHead
          eyebrow="Fila de análise"
          title={activeJobs.length > 0 ? "Analisando agora" : "Últimas análises"}
          desc={
            activeJobs.length > 0
              ? `${activeJobs.length} arquivo${activeJobs.length > 1 ? "s" : ""} no pipeline — as métricas do dashboard atualizam ao concluir.`
              : "Arquivos concluídos nos últimos 15 minutos aparecem aqui com o resumo da IA."
          }
          right={
            activeJobs.length > 0 ? (
              <Chip tone="amber">
                <span className="h-1.5 w-1.5 rounded-full bg-honey-500 animate-pulse-dot" />
                processando
              </Chip>
            ) : undefined
          }
        />
        <div className="mt-4 space-y-3">
          {activeJobs.map((j) => (
            <JobCard key={j.id} job={j} result={undefined} />
          ))}
          {activeJobs.length === 0 &&
            (recentResults.length > 0 ? (
              recentResults.map((c) => (
                <JobCard
                  key={c.id}
                  job={{ id: c.id, name: `${c.customer} · ${c.channel.toLowerCase()}`, kind: c.kind, sizeKB: c.sizeKB, progress: 100 }}
                  result={c}
                />
              ))
            ) : (
              <EmptyState
                icon={<IconUpload className="h-6 w-6" />}
                title="Nenhuma análise recente"
                desc="Envie áudios, e-mails, chats ou documentos acima — ou dispare o lote de exemplo para ver o pipeline em ação."
                action={
                  <Btn variant="primary" onClick={submitSamples}>
                    Analisar arquivos de exemplo <IconArrowRight className="h-4 w-4" />
                  </Btn>
                }
              />
            ))}
        </div>
      </div>
    </div>
  );
}
