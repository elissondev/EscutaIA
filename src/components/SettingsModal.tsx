import { useEffect, useState } from "react";
import { useApp } from "../lib/store";
import { testConnection } from "../lib/ai";
import { Btn, Chip, Field, Modal, Segmented, inputCls } from "./ui";
import { IconAlert, IconCheck, IconShield, IconSpark } from "./icons";

export default function SettingsModal() {
  const { settingsOpen, setSettingsOpen, ai, setAi, toast } = useApp();
  const [draft, setDraft] = useState(ai);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);

  useEffect(() => {
    if (settingsOpen) {
      setDraft(ai);
      setTestResult(null);
    }
  }, [settingsOpen, ai]);

  const openaiMode = draft.mode === "openai";
  const missingKey = openaiMode && draft.apiKey.trim().length === 0;

  const save = () => {
    setAi(draft);
    setSettingsOpen(false);
    toast(
      "success",
      "Motor de IA atualizado",
      openaiMode && draft.apiKey.trim()
        ? `Novos arquivos serão analisados por ${draft.model.trim() || "gpt-4o-mini"}.`
        : "Os uploads continuam usando o motor local simulado."
    );
  };

  const runTest = async () => {
    if (missingKey) {
      setTestResult({ ok: false, message: "Informe a chave da API antes de testar." });
      return;
    }
    setTesting(true);
    setTestResult(null);
    const r = await testConnection(draft);
    setTesting(false);
    setTestResult(r);
  };

  return (
    <Modal open={settingsOpen} onClose={() => setSettingsOpen(false)} title="Motor de IA">
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border border-line bg-paper px-3.5 py-2.5">
          <p className="text-[12.5px] font-medium text-ink-soft">Motor ativo agora</p>
          {ai.mode === "openai" && ai.apiKey.trim() ? (
            <Chip tone="lime">
              <IconSpark className="h-3 w-3" /> {ai.model.trim() || "gpt-4o-mini"}
            </Chip>
          ) : (
            <Chip tone="neutral">Simulado local</Chip>
          )}
        </div>

        <div>
          <p className="mb-1.5 text-[12.5px] font-semibold text-ink-soft">Modo de análise</p>
          <Segmented
            value={draft.mode}
            onChange={(m) => setDraft({ ...draft, mode: m })}
            options={[
              { value: "local", label: "Simulado local" },
              { value: "openai", label: "OpenAI / compatível" },
            ]}
          />
        </div>

        {openaiMode && (
          <>
            <Field label="Chave da API">
              <input
                type="password"
                className={inputCls(missingKey ? " " : null)}
                placeholder="sk-..."
                value={draft.apiKey}
                onChange={(e) => setDraft({ ...draft, apiKey: e.target.value })}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Modelo">
                <input
                  className={inputCls()}
                  placeholder="gpt-4o-mini"
                  value={draft.model}
                  onChange={(e) => setDraft({ ...draft, model: e.target.value })}
                />
              </Field>
              <Field label="URL base">
                <input
                  className={inputCls()}
                  placeholder="https://api.openai.com/v1"
                  value={draft.baseUrl}
                  onChange={(e) => setDraft({ ...draft, baseUrl: e.target.value })}
                />
              </Field>
            </div>
            <p className="text-[12px] leading-snug text-ink-mute">
              Compatível com OpenAI, Groq, OpenRouter e Azure (endpoint{" "}
              <span className="font-mono">/v1</span>). Áudios são transcritos com Whisper antes da
              análise.
            </p>
            {missingKey && (
              <p className="flex items-start gap-2 rounded-lg border border-honey-400/30 bg-honey-100/70 px-3 py-2 text-[12.5px] text-honey-700">
                <IconAlert className="mt-0.5 h-4 w-4 shrink-0" />
                Sem chave, o app ignora este modo e usa o motor local automaticamente.
              </p>
            )}
          </>
        )}

        {testResult && (
          <p
            className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-[12.5px] animate-fade-in ${
              testResult.ok
                ? "border-pine-200 bg-pine-50 text-pine-700"
                : "border-coral-300/40 bg-coral-100 text-coral-700"
            }`}
          >
            {testResult.ok ? (
              <IconCheck className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <IconAlert className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            {testResult.message}
          </p>
        )}

        <div className="flex items-center gap-2 pt-1">
          {openaiMode && (
            <Btn variant="outline" onClick={runTest} disabled={testing}>
              {testing ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-mute/40 border-t-ink-soft" />
                  Testando…
                </>
              ) : (
                "Testar conexão"
              )}
            </Btn>
          )}
          <div className="flex-1" />
          <Btn variant="ghost" onClick={() => setSettingsOpen(false)}>
            Cancelar
          </Btn>
          <Btn onClick={save}>Salvar</Btn>
        </div>

        <p className="flex items-start gap-2 border-t border-linesoft pt-3 text-[11.5px] leading-snug text-ink-mute">
          <IconShield className="mt-0.5 h-4 w-4 shrink-0 text-pine-500" />
          A chave fica somente neste navegador (localStorage) e as chamadas vão direto ao provedor.
          Em produção, mova a chamada para uma Supabase Edge Function — a chave nunca desce para o
          cliente.
        </p>
      </div>
    </Modal>
  );
}
