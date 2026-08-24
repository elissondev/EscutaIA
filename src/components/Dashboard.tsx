import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useApp } from "../lib/store";
import { frictions, predictions, strengths, timeAgo, weeks } from "../lib/data";
import { Btn, Card, Chip, KindIcon, Segmented, SentimentChip, Spark, useCountUp } from "./ui";
import { IconArrowRight, IconTrendDown, IconTrendUp, IconWave } from "./icons";

type Period = "7d" | "30d" | "90d";
type ChartTab = "volume" | "csat" | "tma";

const PERIOD_WEEKS: Record<Period, number> = { "7d": 4, "30d": 8, "90d": 12 };

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-pine-800 bg-pine-950 px-3.5 py-2.5 text-paper shadow-lift-lg">
      <p className="mb-1 font-mono text-[10.5px] uppercase tracking-wider text-pine-400">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="flex items-center gap-2 text-[12.5px] tnum">
          <span className="h-2 w-2 rounded-sm" style={{ background: p.color ?? p.stroke }} />
          {p.name}: <strong>{typeof p.value === "number" ? p.value.toLocaleString("pt-BR") : p.value}</strong>
        </p>
      ))}
    </div>
  );
}

function Kpi({
  label,
  value,
  format,
  delta,
  goodWhenUp,
  points,
  color,
  delay,
}: {
  label: string;
  value: number;
  format: (v: number) => string;
  delta: number;
  goodWhenUp: boolean;
  points: number[];
  color: string;
  delay: number;
}) {
  const v = useCountUp(value);
  const up = delta >= 0;
  const good = up === goodWhenUp;
  return (
    <Card hover className="p-5">
      <div style={{ animationDelay: `${delay}ms` }} className="animate-fade-up">
        <div className="flex items-center justify-between">
          <p className="text-[12.5px] font-semibold text-ink-mute">{label}</p>
          <Chip tone={good ? "green" : "coral"} className="tnum">
            {up ? <IconTrendUp className="h-3 w-3" /> : <IconTrendDown className="h-3 w-3" />}
            {Math.abs(delta).toFixed(1).replace(".", ",")}%
          </Chip>
        </div>
        <p className="mt-2.5 font-mono text-[30px] font-bold leading-none tracking-tight text-ink tnum">
          {format(v)}
        </p>
        <div className={`mt-3 ${color}`}>
          <Spark points={points} />
        </div>
      </div>
    </Card>
  );
}

export default function Dashboard() {
  const { conversations, jobs, setRoute, currentUser } = useApp();
  const [period, setPeriod] = useState<Period>("90d");
  const [tab, setTab] = useState<ChartTab>("volume");

  const slice = useMemo(() => weeks.slice(-PERIOD_WEEKS[period]), [period]);

  const kpis = useMemo(() => {
    const total = slice.reduce((a, w) => a + w.pos + w.neu + w.neg, 0);
    const totalWithApp = total + conversations.length * 3;
    const prevHalf = slice.slice(0, Math.floor(slice.length / 2));
    const lastHalf = slice.slice(Math.floor(slice.length / 2));
    const half = (arr: typeof slice) => arr.reduce((a, w) => a + w.pos + w.neu + w.neg, 0);
    const volDelta = ((half(lastHalf) - half(prevHalf)) / half(prevHalf)) * 100;
    const csatAvg = slice.reduce((a, w) => a + w.csat, 0) / slice.length;
    const csatPrev = prevHalf.reduce((a, w) => a + w.csat, 0) / prevHalf.length;
    const csatLast = lastHalf.reduce((a, w) => a + w.csat, 0) / lastHalf.length;
    const tmaAvg = slice.reduce((a, w) => a + w.tma, 0) / slice.length;
    const tmaPrev = prevHalf.reduce((a, w) => a + w.tma, 0) / prevHalf.length;
    const tmaLast = lastHalf.reduce((a, w) => a + w.tma, 0) / lastHalf.length;
    const negShare = (slice.reduce((a, w) => a + w.neg, 0) / total) * 100;
    const negPrev = (prevHalf.reduce((a, w) => a + w.neg, 0) / half(prevHalf)) * 100;
    const negLast = (lastHalf.reduce((a, w) => a + w.neg, 0) / half(lastHalf)) * 100;
    return {
      total: totalWithApp,
      volDelta,
      csat: csatAvg,
      csatDelta: ((csatLast - csatPrev) / csatPrev) * 100,
      tma: tmaAvg,
      tmaDelta: ((tmaLast - tmaPrev) / tmaPrev) * 100,
      fric: negShare,
      fricDelta: negLast - negPrev,
      volPoints: slice.map((w) => w.pos + w.neu + w.neg),
      csatPoints: slice.map((w) => w.csat),
      tmaPoints: slice.map((w) => w.tma),
      fricPoints: slice.map((w) => (w.neg / (w.pos + w.neu + w.neg)) * 100),
    };
  }, [slice, conversations.length]);

  const csatForecast = useMemo(() => {
    const data = slice.map((w) => ({ week: w.week, csat: w.csat, proj: null as number | null }));
    const last = slice[slice.length - 1];
    data[data.length - 1].proj = last.csat;
    return [
      ...data,
      { week: "+1 sem", csat: null as unknown as number, proj: last.csat + 2 },
      { week: "+2 sem", csat: null as unknown as number, proj: last.csat + 4 },
    ];
  }, [slice]);

  const maxFriction = Math.max(...frictions.map((f) => f.mentions));
  const recent = conversations.slice(0, 5);
  const firstName = currentUser?.name.split(" ")[0];

  return (
    <div className="space-y-6">
      {/* cabeçalho */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-pine-500">
            {new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long" }).format(
              new Date()
            )}
          </p>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink">
            Olá, {firstName} — seu suporte gerou {kpis.total.toLocaleString("pt-BR")} interações
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1.5 font-mono text-[11px] text-ink-mute sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-lime-500 animate-pulse-dot" />
            atualizado agora
          </span>
          <Segmented
            value={period}
            onChange={setPeriod}
            options={[
              { value: "7d", label: "7 dias" },
              { value: "30d", label: "30 dias" },
              { value: "90d", label: "90 dias" },
            ]}
          />
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          label="Conversas analisadas"
          value={kpis.total}
          format={(v) => Math.round(v).toLocaleString("pt-BR")}
          delta={kpis.volDelta}
          goodWhenUp={true}
          points={kpis.volPoints}
          color="text-pine-500"
          delay={0}
        />
        <Kpi
          label="CSAT estimado"
          value={kpis.csat}
          format={(v) => `${Math.round(v)} pts`}
          delta={kpis.csatDelta}
          goodWhenUp={true}
          points={kpis.csatPoints}
          color="text-lime-600"
          delay={60}
        />
        <Kpi
          label="1ª resposta (média)"
          value={kpis.tma}
          format={(v) => `${v.toFixed(1).replace(".", ",")} min`}
          delta={kpis.tmaDelta}
          goodWhenUp={false}
          points={kpis.tmaPoints}
          color="text-honey-500"
          delay={120}
        />
        <Kpi
          label="Índice de fricção"
          value={kpis.fric}
          format={(v) => `${v.toFixed(1).replace(".", ",")}%`}
          delta={kpis.fricDelta}
          goodWhenUp={false}
          points={kpis.fricPoints}
          color="text-coral-500"
          delay={180}
        />
      </div>

      {/* gráfico + fricções */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="p-5 xl:col-span-2 animate-fade-up" >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-base font-bold text-ink">Evolução do suporte</h3>
              <p className="text-[12.5px] text-ink-mute">Dados agregados de todos os canais enviados</p>
            </div>
            <Segmented
              value={tab}
              onChange={setTab}
              options={[
                { value: "volume", label: "Volume" },
                { value: "csat", label: "CSAT" },
                { value: "tma", label: "TMA" },
              ]}
            />
          </div>

          <div className="mt-4 h-[268px]" key={tab + period}>
            {tab === "volume" && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={slice} margin={{ top: 6, right: 4, left: -14, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gpos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3c7d58" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#3c7d58" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="gneg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#e4573d" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="#e4573d" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e5d8" vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#707d70", fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#707d70", fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="pos" name="Positivas" stackId="1" stroke="#3c7d58" strokeWidth={2} fill="url(#gpos)" />
                  <Area type="monotone" dataKey="neu" name="Neutras" stackId="1" stroke="#a8b3a0" strokeWidth={1.5} fill="#a8b3a0" fillOpacity={0.18} />
                  <Area type="monotone" dataKey="neg" name="Negativas" stackId="1" stroke="#e4573d" strokeWidth={2} fill="url(#gneg)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
            {tab === "csat" && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={csatForecast} margin={{ top: 6, right: 4, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e5d8" vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#707d70", fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[60, 85]} tick={{ fontSize: 11, fill: "#707d70", fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line type="monotone" dataKey="csat" name="CSAT real" stroke="#1f5238" strokeWidth={2.5} dot={{ r: 3, fill: "#1f5238" }} connectNulls />
                  <Line type="monotone" dataKey="proj" name="Projeção IA" stroke="#b3d943" strokeWidth={2.5} strokeDasharray="6 5" dot={{ r: 3, fill: "#b3d943" }} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            )}
            {tab === "tma" && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={slice} margin={{ top: 6, right: 4, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e5d8" vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#707d70", fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#707d70", fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} unit="m" />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(60,125,88,0.06)" }} />
                  <Bar dataKey="tma" name="Min. até 1ª resp." fill="#3c7d58" radius={[5, 5, 0, 0]} maxBarSize={34} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {tab === "csat" && (
            <p className="mt-2 flex items-center gap-2 text-[12px] text-ink-mute">
              <span className="inline-block h-0.5 w-6 rounded bg-lime-500" />
              Trecho tracejado: projeção da IA para as próximas semanas
            </p>
          )}
        </Card>

        {/* top fricções */}
        <Card className="p-5 animate-fade-up" >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-bold text-ink">Top fricções</h3>
              <p className="text-[12.5px] text-ink-mute">O que mais gera contato</p>
            </div>
            <Btn variant="ghost" size="sm" onClick={() => setRoute("insights")}>
              Ver insights <IconArrowRight className="h-3.5 w-3.5" />
            </Btn>
          </div>
          <div className="mt-4 space-y-4">
            {frictions.map((f, i) => (
              <div key={f.id} className="group">
                <div className="flex items-center justify-between gap-2">
                  <p className="flex items-center gap-2 text-[13px] font-semibold text-ink">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-pine-800 font-mono text-[10.5px] font-bold text-lime-300">
                      {i + 1}
                    </span>
                    <span className="truncate">{f.title}</span>
                  </p>
                  <span
                    className={`flex shrink-0 items-center gap-0.5 font-mono text-[11px] font-semibold tnum ${
                      f.trend >= 0 ? "text-coral-600" : "text-pine-600"
                    }`}
                  >
                    {f.trend >= 0 ? <IconTrendUp className="h-3 w-3" /> : <IconTrendDown className="h-3 w-3" />}
                    {f.trend > 0 ? "+" : ""}
                    {f.trend}%
                  </span>
                </div>
                <div className="mt-1.5 flex items-center gap-2.5 pl-7">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-linesoft">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        f.impact === "alto" ? "bg-coral-500" : f.impact === "medio" ? "bg-honey-500" : "bg-pine-500"
                      }`}
                      style={{ width: `${(f.mentions / maxFriction) * 100}%` }}
                    />
                  </div>
                  <span className="w-14 text-right font-mono text-[11px] text-ink-mute tnum">
                    {f.mentions}x
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* fortes + previsão + feed */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="p-5 animate-fade-up">
          <h3 className="font-display text-base font-bold text-ink">Pontos fortes</h3>
          <p className="text-[12.5px] text-ink-mute">Onde seu suporte já vence</p>
          <div className="mt-4 space-y-3.5">
            {strengths.slice(0, 3).map((s) => (
              <div key={s.id} className="flex items-center gap-3 rounded-lg border border-linesoft bg-paper/60 px-3.5 py-3 transition-colors hover:border-pine-200">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
                  <svg viewBox="0 0 36 36" className="h-10 w-10 -rotate-90">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="#e0e5d8" strokeWidth="4" />
                    <circle
                      cx="18" cy="18" r="15" fill="none" stroke="#3c7d58" strokeWidth="4" strokeLinecap="round"
                      strokeDasharray={`${(s.score / 100) * 94.2} 94.2`}
                    />
                  </svg>
                  <span className="absolute font-mono text-[10.5px] font-bold text-pine-700 tnum">{s.score}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold leading-tight text-ink">{s.title}</p>
                  <p className="mt-0.5 line-clamp-1 text-[12px] text-ink-mute">{s.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="relative overflow-hidden p-5 animate-fade-up">
          <div className="glow-lime pointer-events-none absolute -right-16 -top-16 h-56 w-56" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-ink">Previsão em destaque</h3>
              <Chip tone="lime">
                <IconWave className="h-3 w-3" /> confiança {predictions[0].confidence}%
              </Chip>
            </div>
            <p className="mt-3 font-display text-[17px] font-bold leading-snug text-ink">
              {predictions[0].title}: <span className="text-coral-600">+34% de contatos</span> nas
              próximas 2 semanas
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{predictions[0].detail}</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-linesoft">
              <div className="h-full rounded-full bg-lime-500 stripes-bar" style={{ width: `${predictions[0].confidence}%` }} />
            </div>
            <div className="mt-4 flex gap-2">
              <Btn variant="outline" size="sm" onClick={() => setRoute("insights")}>
                Todas as previsões
              </Btn>
              <Btn variant="primary" size="sm" onClick={() => setRoute("reports")}>
                Gerar relatório
              </Btn>
            </div>
          </div>
        </Card>

        <Card className="p-5 animate-fade-up">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-ink">Atividade recente</h3>
            {jobs.length > 0 && (
              <Chip tone="amber">
                <span className="h-1.5 w-1.5 rounded-full bg-honey-500 animate-pulse-dot" />
                {jobs.length} analisando
              </Chip>
            )}
          </div>
          <div className="mt-3 divide-y divide-linesoft">
            {jobs.slice(0, 2).map((j) => (
              <div key={j.id} className="flex items-center gap-3 py-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-honey-100 text-honey-600">
                  <KindIcon kind={j.kind} className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-ink">{j.name}</p>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-linesoft">
                    <div className="h-full rounded-full bg-honey-500 stripes-bar transition-all" style={{ width: `${j.progress}%` }} />
                  </div>
                </div>
                <span className="font-mono text-[11px] text-honey-600 tnum">{Math.round(j.progress)}%</span>
              </div>
            ))}
            {recent.slice(0, jobs.length > 0 ? 3 : 5).map((c) => (
              <button
                key={c.id}
                onClick={() => setRoute("inbox")}
                className="flex w-full items-center gap-3 py-2.5 text-left transition-colors hover:bg-paper/70 cursor-pointer rounded-md px-1 -mx-1"
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    c.sentiment === "positivo"
                      ? "bg-pine-100 text-pine-600"
                      : c.sentiment === "negativo"
                        ? "bg-coral-100 text-coral-600"
                        : "bg-honey-100 text-honey-600"
                  }`}
                >
                  <KindIcon kind={c.kind} className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-ink">{c.title}</p>
                  <p className="text-[11.5px] text-ink-mute">
                    {c.customer} · {timeAgo(c.date)}
                  </p>
                </div>
                <SentimentChip s={c.sentiment} />
              </button>
            ))}
          </div>
        </Card>
      </div>

    </div>
  );
}
