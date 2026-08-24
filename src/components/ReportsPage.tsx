import { useState } from "react";
import { useApp } from "../lib/store";
import { fmtDateTime } from "../lib/data";
import { Btn, Card, Chip, EmptyState, Field, LockedNote, Modal, SectionHead, Segmented, inputCls } from "./ui";
import { IconDownload, IconEye, IconReport, IconTrash } from "./icons";

const SECTIONS = [
  { id: "resumo", label: "Resumo executivo" },
  { id: "friccoes", label: "Top fricções" },
  { id: "fortes", label: "Pontos fortes" },
  { id: "previsoes", label: "Previsões da IA" },
  { id: "plano", label: "Plano de ação" },
];

function downloadReport(title: string, content: string) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `escuta-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 48)}.md`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const { reports, generateReport, deleteReport, permissions, toast, conversations } = useApp();
  const [title, setTitle] = useState("Diagnóstico quinzenal de suporte");
  const [period, setPeriod] = useState("Últimos 30 dias");
  const [sections, setSections] = useState<string[]>(SECTIONS.map((s) => s.id));
  const [preview, setPreview] = useState<{ title: string; content: string } | null>(null);
  const [generating, setGenerating] = useState(false);

  const toggleSection = (id: string) =>
    setSections((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));

  const onGenerate = () => {
    if (sections.length === 0) {
      toast("error", "Selecione ao menos uma seção", "O relatório precisa de conteúdo para compilar.");
      return;
    }
    setGenerating(true);
    setTimeout(() => {
      const r = generateReport(title.trim() || "Relatório Escuta", period, sections);
      setGenerating(false);
      if (r) {
        downloadReport(r.title, r.content);
        toast("success", "Relatório gerado", "Download do arquivo .md iniciado.");
      }
    }, 900);
  };

  return (
    <div className="space-y-6">
      {!permissions.canReport && (
        <LockedNote
          title="Geração de relatórios indisponível"
          desc="Seu papel de Visualização permite baixar relatórios existentes, mas não gerar novos. Um Administrador pode elevar seu nível em Equipe."
        />
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        {/* gerador */}
        <Card className="p-5 xl:col-span-2">
          <SectionHead eyebrow="Compilador" title="Novo relatório" desc="A IA consolida os insights do período em um documento executivo." />
          <div className="mt-4 space-y-4">
            <Field label="Título do relatório">
              <input
                className={inputCls()}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex.: Fechamento do mês — suporte"
              />
            </Field>
            <div>
              <p className="mb-1.5 text-[12.5px] font-semibold text-ink-soft">Período</p>
              <Segmented
                value={period}
                onChange={setPeriod}
                options={[
                  { value: "Últimos 7 dias", label: "7 dias" },
                  { value: "Últimos 30 dias", label: "30 dias" },
                  { value: "Trimestre", label: "90 dias" },
                ]}
              />
            </div>
            <div>
              <p className="mb-1.5 text-[12.5px] font-semibold text-ink-soft">Seções incluídas</p>
              <div className="flex flex-wrap gap-2">
                {SECTIONS.map((s) => {
                  const on = sections.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => toggleSection(s.id)}
                      className={`rounded-lg border px-3 py-1.5 text-[12.5px] font-medium transition-all duration-150 cursor-pointer ${
                        on
                          ? "border-pine-300 bg-pine-700 text-paper shadow-sm"
                          : "border-line bg-card text-ink-mute hover:border-pine-200 hover:text-ink"
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <Btn className="w-full" onClick={onGenerate} disabled={!permissions.canReport || generating}>
              {generating ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-paper/40 border-t-paper" />
                  Compilando insights…
                </>
              ) : (
                <>
                  <IconReport className="h-4 w-4" /> Gerar relatório (.md)
                </>
              )}
            </Btn>
            <p className="text-center font-mono text-[10.5px] text-ink-mute">
              {conversations.length} conversas na base · PDF e agendamento na próxima evolução
            </p>
          </div>
        </Card>

        {/* histórico */}
        <div className="xl:col-span-3">
          <SectionHead
            eyebrow={`Histórico · ${reports.length} documento${reports.length !== 1 ? "s" : ""}`}
            title="Relatórios gerados"
            desc="Todos os documentos compilados pela equipe, com download e pré-visualização."
          />
          <div className="mt-4 space-y-3">
            {reports.length === 0 ? (
              <EmptyState
                icon={<IconReport className="h-6 w-6" />}
                title="Nenhum relatório ainda"
                desc="Gere o primeiro diagnóstico executivo — ele aparece aqui para toda a equipe baixar e compartilhar."
                action={
                  permissions.canReport ? (
                    <Btn variant="primary" onClick={onGenerate}>Gerar agora</Btn>
                  ) : undefined
                }
              />
            ) : (
              reports.map((r, i) => (
                <Card key={r.id} hover className="flex flex-wrap items-center gap-3.5 p-4 animate-fade-up">
                  <div style={{ animationDelay: `${i * 50}ms` }} className="animate-fade-up flex min-w-0 flex-1 items-center gap-3.5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pine-950 text-lime-400">
                      <IconReport className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[13.5px] font-semibold text-ink">{r.title}</p>
                      <p className="mt-0.5 truncate text-[12px] text-ink-mute">
                        {r.period} · {r.sections.length} seções · {r.author} · {fmtDateTime(r.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <Chip tone="neutral" className="tnum">{(r.content.length / 1024).toFixed(1)} KB</Chip>
                    <Btn variant="ghost" size="sm" onClick={() => setPreview({ title: r.title, content: r.content })}>
                      <IconEye className="h-4 w-4" /> Ver
                    </Btn>
                    <Btn variant="outline" size="sm" onClick={() => downloadReport(r.title, r.content)}>
                      <IconDownload className="h-4 w-4" /> Baixar
                    </Btn>
                    {permissions.canTeam && (
                      <Btn
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          deleteReport(r.id);
                          toast("info", "Relatório excluído", `“${r.title}” foi removido do histórico.`);
                        }}
                      >
                        <IconTrash className="h-4 w-4 text-coral-500" />
                      </Btn>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      <Modal open={!!preview} onClose={() => setPreview(null)} title={preview?.title ?? ""} wide>
        <pre className="whitespace-pre-wrap rounded-lg border border-line bg-paper p-4 font-mono text-[12px] leading-relaxed text-ink-soft">
          {preview?.content}
        </pre>
        <div className="mt-4 flex justify-end gap-2">
          <Btn variant="outline" size="sm" onClick={() => setPreview(null)}>Fechar</Btn>
          {preview && (
            <Btn variant="primary" size="sm" onClick={() => downloadReport(preview.title, preview.content)}>
              <IconDownload className="h-4 w-4" /> Baixar .md
            </Btn>
          )}
        </div>
      </Modal>
    </div>
  );
}
