import { useState } from "react";
import { useApp } from "../lib/store";
import { frictions, predictions, strengths } from "../lib/data";
import { Btn, Card, Chip, SectionHead } from "./ui";
import { IconChevron, IconCheck, IconTarget, IconTrendDown, IconTrendUp, IconWave } from "./icons";

export default function InsightsPage() {
  const { setRoute } = useApp();
  const [open, setOpen] = useState<string | null>(frictions[0].id);
  const maxMentions = Math.max(...frictions.map((f) => f.mentions));

  return (
    <div className="space-y-8">
      {/* fricções */}
      <section className="space-y-4">
        <SectionHead
          eyebrow="Diagnóstico · pontos de fricção"
          title="O que está gerando atrito no seu suporte"
          desc="A IA cruza todas as conversas, agrupa por causa-raiz e ranqueia pelo volume de menções e tendência. Clique para abrir evidências e ação sugerida."
          right={
            <Btn variant="primary" size="sm" onClick={() => setRoute("reports")}>
              Compilar em relatório
            </Btn>
          }
        />
        <div className="space-y-3">
          {frictions.map((f, i) => {
            const isOpen = open === f.id;
            return (
              <Card key={f.id} className={`overflow-hidden transition-all duration-200 ${isOpen ? "border-pine-300 shadow-lift" : "hover:border-pine-200"}`}>
                <button
                  onClick={() => setOpen(isOpen ? null : f.id)}
                  className="flex w-full items-center gap-4 px-5 py-4 text-left cursor-pointer"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-pine-950 font-mono text-[13px] font-bold text-lime-300 tnum">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-[15px] font-bold tracking-tight text-ink">{f.title}</h3>
                      <Chip tone={f.impact === "alto" ? "coral" : f.impact === "medio" ? "amber" : "green"}>
                        impacto {f.impact === "medio" ? "médio" : f.impact}
                      </Chip>
                      <Chip tone="neutral">{f.category}</Chip>
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="h-1.5 max-w-[280px] flex-1 overflow-hidden rounded-full bg-linesoft">
                        <div
                          className={`h-full rounded-full ${f.impact === "alto" ? "bg-coral-500" : f.impact === "medio" ? "bg-honey-500" : "bg-pine-500"}`}
                          style={{ width: `${(f.mentions / maxMentions) * 100}%` }}
                        />
                      </div>
                      <span className="font-mono text-[11.5px] text-ink-mute tnum">{f.mentions} menções</span>
                      <span className={`flex items-center gap-0.5 font-mono text-[11.5px] font-semibold tnum ${f.trend >= 0 ? "text-coral-600" : "text-pine-600"}`}>
                        {f.trend >= 0 ? <IconTrendUp className="h-3 w-3" /> : <IconTrendDown className="h-3 w-3" />}
                        {f.trend > 0 ? "+" : ""}{f.trend}%
                      </span>
                    </div>
                  </div>
                  <IconChevron className={`h-4.5 w-4.5 shrink-0 text-ink-mute transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`} />
                </button>

                {isOpen && (
                  <div className="grid grid-cols-1 gap-4 border-t border-linesoft bg-paper/60 px-5 py-5 animate-fade-in lg:grid-cols-5">
                    <div className="lg:col-span-3">
                      <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-pine-500">Leitura da IA</p>
                      <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">{f.insight}</p>
                      <p className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.16em] text-pine-500">Evidências reais</p>
                      <div className="mt-2 space-y-2.5">
                        {f.evidences.map((e) => (
                          <blockquote key={e} className="rounded-lg border-l-[3px] border-lime-500 bg-card px-3.5 py-2.5 text-[13px] italic leading-relaxed text-ink">
                            {e}
                          </blockquote>
                        ))}
                      </div>
                    </div>
                    <div className="lg:col-span-2">
                      <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-pine-500">Ação sugerida</p>
                      <div className="mt-2 rounded-xl border border-pine-200 bg-pine-50 p-4">
                        <div className="flex items-start gap-2.5">
                          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pine-700 text-lime-300">
                            <IconTarget className="h-3.5 w-3.5" />
                          </span>
                          <p className="text-[13px] font-medium leading-relaxed text-pine-800">{f.action}</p>
                        </div>
                      </div>
                      <div className="mt-3 rounded-xl bg-pine-950 p-4 text-paper">
                        <p className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-lime-400">
                          <IconWave className="h-3.5 w-3.5" /> impacto projetado
                        </p>
                        <p className="mt-1.5 text-[12.5px] leading-relaxed text-pine-200">
                          {f.impact === "alto"
                            ? "Redução estimada de 30–40% nos contatos deste tema em 30 dias após a correção."
                            : f.impact === "medio"
                              ? "Redução estimada de 15–25% nos contatos deste tema no próximo ciclo."
                              : "Monitoramento contínuo — tendência ainda não crítica."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      {/* pontos fortes */}
      <section className="space-y-4">
        <SectionHead
          eyebrow="Diagnóstico · pontos fortes"
          title="O que o seu suporte já faz melhor que o mercado"
          desc="Nem só de problema vive o diagnóstico — estes padrões positivos apareceram consistentemente nas conversas."
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {strengths.map((s, i) => (
            <Card key={s.id} hover className="p-5 animate-fade-up">
              <div style={{ animationDelay: `${i * 60}ms` }} className="animate-fade-up">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-[15px] font-bold tracking-tight text-ink">{s.title}</p>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">{s.detail}</p>
                  </div>
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
                    <svg viewBox="0 0 36 36" className="h-14 w-14 -rotate-90">
                      <circle cx="18" cy="18" r="15" fill="none" stroke="#e0e5d8" strokeWidth="3.5" />
                      <circle
                        cx="18" cy="18" r="15" fill="none" stroke="#3c7d58" strokeWidth="3.5" strokeLinecap="round"
                        strokeDasharray={`${(s.score / 100) * 94.2} 94.2`}
                      />
                    </svg>
                    <span className="absolute font-mono text-[13px] font-bold text-pine-700 tnum">{s.score}</span>
                  </div>
                </div>
                <blockquote className="mt-3.5 flex items-start gap-2 rounded-lg bg-pine-50/80 px-3.5 py-2.5 text-[12.5px] italic text-pine-800">
                  <IconCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-pine-500" />
                  {s.quote}
                </blockquote>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* previsões */}
      <section className="space-y-4">
        <SectionHead
          eyebrow="Predições"
          title="O que a IA espera das próximas semanas"
          desc="Previsões geradas a partir da série histórica e dos temas em aceleração. Cada uma vem com intervalo de confiança."
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {predictions.map((p, i) => (
            <Card key={p.id} hover className="relative overflow-hidden p-5 animate-fade-up">
              <div style={{ animationDelay: `${i * 60}ms` }} className="animate-fade-up">
                <div className="flex items-center justify-between gap-2">
                  <Chip tone={p.confidence >= 80 ? "lime" : "amber"} className="tnum">
                    confiança {p.confidence}%
                  </Chip>
                  <Chip tone="neutral">{p.horizon}</Chip>
                </div>
                <h3 className="mt-3 font-display text-[15px] font-bold tracking-tight text-ink">{p.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">{p.detail}</p>
                <div className="mt-3.5 h-1.5 overflow-hidden rounded-full bg-linesoft">
                  <div
                    className={`h-full rounded-full ${p.confidence >= 80 ? "bg-lime-500" : "bg-honey-500"}`}
                    style={{ width: `${p.confidence}%` }}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
