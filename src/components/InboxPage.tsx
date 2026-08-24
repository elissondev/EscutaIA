import { useMemo, useState } from "react";
import { useApp } from "../lib/store";
import { KIND_META, fmtDate, frictions, timeAgo } from "../lib/data";
import type { Conversation, FileKind, Sentiment } from "../lib/data";
import { Btn, Card, Chip, EmptyState, KindIcon, SectionHead, SentimentChip, inputCls } from "./ui";
import { IconInbox, IconSearch, IconX } from "./icons";

export default function InboxPage() {
  const { conversations } = useApp();
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<FileKind | "todos">("todos");
  const [sentiment, setSentiment] = useState<Sentiment | "todos">("todos");
  const [selected, setSelected] = useState<Conversation | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return conversations.filter((c) => {
      if (kind !== "todos" && c.kind !== kind) return false;
      if (sentiment !== "todos" && c.sentiment !== sentiment) return false;
      if (
        q &&
        !`${c.title} ${c.customer} ${c.channel} ${c.tags.join(" ")} ${c.summary}`
          .toLowerCase()
          .includes(q)
      )
        return false;
      return true;
    });
  }, [conversations, query, kind, sentiment]);

  const frictionOf = (c: Conversation) => (c.frictionId ? frictions.find((f) => f.id === c.frictionId) : undefined);

  return (
    <div className="space-y-4">
      <SectionHead
        eyebrow={`Base de conhecimento · ${conversations.length} itens`}
        title="Conversas analisadas"
        desc="Cada arquivo enviado vira um registro pesquisável com sentimento, tags e fricção vinculada."
      />

      {/* filtros */}
      <Card className="flex flex-wrap items-center gap-2.5 p-3.5">
        <div className="relative min-w-[220px] flex-1">
          <IconSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" />
          <input
            className={`${inputCls()} pl-10`}
            placeholder="Buscar por cliente, tema, tag…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          className="rounded-lg border border-line bg-card px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-pine-400 cursor-pointer"
          value={kind}
          onChange={(e) => setKind(e.target.value as FileKind | "todos")}
        >
          <option value="todos">Todos os tipos</option>
          {(Object.keys(KIND_META) as FileKind[]).map((k) => (
            <option key={k} value={k}>{KIND_META[k].label}</option>
          ))}
        </select>
        <select
          className="rounded-lg border border-line bg-card px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-pine-400 cursor-pointer"
          value={sentiment}
          onChange={(e) => setSentiment(e.target.value as Sentiment | "todos")}
        >
          <option value="todos">Todo sentimento</option>
          <option value="positivo">Positivo</option>
          <option value="neutro">Neutro</option>
          <option value="negativo">Negativo</option>
        </select>
        <Chip tone="neutral" className="tnum">{filtered.length} resultado{filtered.length !== 1 ? "s" : ""}</Chip>
      </Card>

      {/* lista */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<IconInbox className="h-6 w-6" />}
          title="Nada encontrado"
          desc="Nenhuma conversa bate com essa combinação de filtros. Ajuste a busca ou limpe os filtros."
          action={
            <Btn
              variant="outline"
              onClick={() => {
                setQuery("");
                setKind("todos");
                setSentiment("todos");
              }}
            >
              Limpar filtros
            </Btn>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-line bg-card">
          {filtered.map((c, i) => {
            const fr = frictionOf(c);
            return (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                className={`group flex w-full items-center gap-3.5 px-4 py-3.5 text-left transition-colors hover:bg-pine-50/70 cursor-pointer ${
                  i > 0 ? "border-t border-linesoft" : ""
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    c.sentiment === "positivo"
                      ? "bg-pine-100 text-pine-600"
                      : c.sentiment === "negativo"
                        ? "bg-coral-100 text-coral-600"
                        : "bg-honey-100 text-honey-600"
                  }`}
                >
                  <KindIcon kind={c.kind} className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-semibold text-ink group-hover:text-pine-700">
                    {c.title}
                  </p>
                  <p className="mt-0.5 truncate text-[12px] text-ink-mute">
                    {c.customer} · {c.channel}
                    {c.duration ? ` · ${c.duration}` : ""} · {fmtDate(c.date)}
                  </p>
                </div>
                <div className="hidden shrink-0 items-center gap-1.5 md:flex">
                  {c.tags.slice(0, 2).map((t) => (
                    <Chip key={t} tone="neutral">#{t}</Chip>
                  ))}
                  {fr && <Chip tone="coral">{fr.category}</Chip>}
                </div>
                <div className="hidden shrink-0 sm:block">
                  <SentimentChip s={c.sentiment} />
                </div>
                <span className="shrink-0 font-mono text-[11px] text-ink-mute tnum">{timeAgo(c.date)}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* painel de detalhe */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end bg-pine-950/45 backdrop-blur-[2px] animate-fade-in" onClick={() => setSelected(null)}>
          <div
            className="flex h-full w-full max-w-[480px] flex-col overflow-y-auto border-l border-line bg-paper shadow-lift-lg animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-paper/90 px-5 py-4 backdrop-blur">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-pine-950 text-lime-400">
                  <KindIcon kind={selected.kind} className="h-4.5 w-4.5" />
                </span>
                <div>
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-pine-500">
                    {KIND_META[selected.kind].label} · {selected.channel}
                  </p>
                  <p className="text-[13px] font-semibold text-ink">{selected.customer}</p>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="rounded-md p-2 text-ink-mute transition-colors hover:bg-linesoft hover:text-ink cursor-pointer"
              >
                <IconX className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div>
                <h3 className="font-display text-lg font-bold leading-snug tracking-tight text-ink">
                  {selected.title}
                </h3>
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  <SentimentChip s={selected.sentiment} />
                  {selected.tags.map((t) => (
                    <Chip key={t} tone="neutral">#{t}</Chip>
                  ))}
                  <Chip tone="neutral" className="tnum">{selected.sizeKB} KB</Chip>
                  {selected.duration && <Chip tone="neutral">{selected.duration}</Chip>}
                </div>
              </div>

              <div className="rounded-xl border border-pine-200 bg-pine-50/70 p-4">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-pine-600">
                  Trecho destacado pela IA
                </p>
                <blockquote className="mt-2 border-l-[3px] border-lime-500 pl-3 text-[13.5px] font-medium italic leading-relaxed text-ink">
                  {selected.excerpt}
                </blockquote>
              </div>

              <div>
                <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-pine-500">
                  Resumo da análise
                </p>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">{selected.summary}</p>
              </div>

              {(() => {
                const fr = frictionOf(selected);
                return fr ? (
                  <div className="rounded-xl border border-coral-300/40 bg-coral-100/60 p-4">
                    <p className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-coral-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-coral-500" />
                      Fricção vinculada · impacto {fr.impact === "medio" ? "médio" : fr.impact}
                    </p>
                    <p className="mt-1.5 text-[13.5px] font-bold text-ink">{fr.title}</p>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-ink-soft">{fr.insight}</p>
                    <p className="mt-2.5 rounded-lg bg-card px-3 py-2 text-[12.5px] font-medium text-pine-700">
                      Ação sugerida: {fr.action}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-line bg-card p-4">
                    <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-pine-500">
                      Fricção vinculada
                    </p>
                    <p className="mt-1.5 text-[13px] text-ink-soft">
                      Nenhuma fricção conhecida — esta conversa reforça padrões positivos ou entra como observação neutra.
                    </p>
                  </div>
                );
              })()}

              <p className="font-mono text-[11px] text-ink-mute tnum">
                Analisado em {fmtDate(selected.date)} · {timeAgo(selected.date)} · modelo escuta-core v2
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
