import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  IconArrowRight,
  IconChat,
  IconCheck,
  IconChevron,
  IconClock,
  IconDoc,
  IconMail,
  IconMic,
  IconShield,
  IconSpark,
  IconTarget,
  IconTrendDown,
  IconTrendUp,
  IconWave,
  IconX,
  LogoMark,
} from "./icons";

/* ------------------------------ configurações ------------------------------ */

const WHATS_NUMBER = "5542999355018";
const WHATS_DISPLAY = "(42) 99935-5018";
const wa = (text: string) => `https://wa.me/${WHATS_NUMBER}?text=${encodeURIComponent(text)}`;

const WA_MSG_DIAG = "Oi! Vi a Escuta e quero um diagnóstico gratuito do meu suporte.";
const WA_MSG_DEMO = "Oi! Quero ver uma demonstração da Escuta no meu contexto.";
const WA_MSG_FUNDADOR = "Oi! Quero garantir uma das vagas do Programa Fundador da Escuta.";

/* --------------------------------- helpers --------------------------------- */

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out will-change-transform ${
        on ? "translate-y-0 opacity-100" : "translate-y-7 opacity-0"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function CountUp({
  to,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1300,
}: {
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [v, setV] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || started.current) return;
        started.current = true;
        const t0 = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - t0) / duration);
          setV(to * (1 - Math.pow(1 - t, 3)));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.disconnect();
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);
  return (
    <span ref={ref} className="tnum">
      {prefix}
      {v.toLocaleString("pt-BR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

const WaIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M12 3.2a8.8 8.8 0 0 0-7.6 13.2L3 20.8l4.5-1.3A8.8 8.8 0 1 0 12 3.2Z" />
    <path d="M8.9 8.9c-.3 2.6 3.6 6.5 6.2 6.2l.8-1.5-2-1-.9.7c-.9-.4-1.7-1.2-2.1-2.1l.7-.9-1-2-1.7.6Z" />
  </svg>
);

const PlayIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M8 5.5v13l11-6.5-11-6.5Z" />
  </svg>
);

function WaButton({
  msg,
  label,
  sub,
  size = "md",
  className = "",
}: {
  msg: string;
  label: string;
  sub?: string;
  size?: "md" | "lg";
  className?: string;
}) {
  return (
    <a
      href={wa(msg)}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center justify-center gap-2.5 rounded-xl bg-lime-400 font-semibold text-pine-950 shadow-lift transition-all duration-200 hover:-translate-y-0.5 hover:bg-lime-300 hover:shadow-lift-lg active:translate-y-0 active:scale-[0.98] ${
        size === "lg" ? "px-7 py-4 text-[15px]" : "px-5 py-3 text-sm"
      } ${className}`}
    >
      <WaIcon className={size === "lg" ? "h-5.5 w-5.5" : "h-5 w-5"} />
      <span className="text-left leading-tight">
        {label}
        {sub && <span className="block font-mono text-[10.5px] font-medium uppercase tracking-wide text-pine-800/80">{sub}</span>}
      </span>
    </a>
  );
}

function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <p className={`font-mono text-[11px] font-semibold uppercase tracking-[0.18em] ${dark ? "text-lime-400" : "text-pine-500"}`}>
      {children}
    </p>
  );
}

/* --------------------------- hero: análise ao vivo --------------------------- */

const EQ = Array.from({ length: 22 }, (_, i) => ({
  h: 20 + Math.round(62 * Math.abs(Math.sin(i * 0.9 + 1))),
  d: (i % 6) * 0.11,
}));

const PHASES = ["Ouvir", "Ler", "Classificar", "Diagnosticar"] as const;

function LiveAnalysis() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const timers: number[] = [];
    let alive = true;
    const loop = () => {
      if (!alive) return;
      setPhase(0);
      timers.push(window.setTimeout(() => alive && setPhase(1), 1500));
      timers.push(window.setTimeout(() => alive && setPhase(2), 3600));
      timers.push(window.setTimeout(() => alive && setPhase(3), 4900));
      timers.push(window.setTimeout(loop, 9800));
    };
    loop();
    return () => {
      alive = false;
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="relative">
      <div className="glow-lime pointer-events-none absolute -right-16 -top-16 h-72 w-72" />

      {/* janela da análise */}
      <div className="relative overflow-hidden rounded-2xl border border-pine-800 bg-pine-950 shadow-lift-lg">
        <div className="flex items-center justify-between border-b border-pine-800/80 px-5 py-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-coral-500" />
            <span className="h-2.5 w-2.5 rounded-full bg-honey-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-lime-400" />
          </div>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-pine-400">
            escuta · análise nº 4.821
          </p>
          <span className="flex items-center gap-1.5 font-mono text-[10.5px] text-lime-300">
            <span className="h-1.5 w-1.5 rounded-full bg-lime-400 animate-pulse-dot" /> ao vivo
          </span>
        </div>

        <div className="space-y-4 p-5">
          {/* pipeline */}
          <div className="flex items-center gap-1.5">
            {PHASES.map((p, i) => (
              <div key={p} className="flex flex-1 items-center gap-1.5">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-bold transition-all duration-300 ${
                    i < phase
                      ? "bg-pine-700 text-lime-300"
                      : i === phase
                        ? "bg-lime-400 text-pine-950 shadow-[0_0_14px_rgba(201,239,95,0.5)]"
                        : "bg-pine-900 text-pine-500"
                  }`}
                >
                  {i < phase ? <IconCheck className="h-3 w-3" /> : i + 1}
                </span>
                <span
                  className={`hidden text-[10.5px] font-medium sm:block ${
                    i <= phase ? "text-pine-200" : "text-pine-600"
                  }`}
                >
                  {p}
                </span>
                {i < PHASES.length - 1 && (
                  <span className={`h-px flex-1 ${i < phase ? "bg-pine-600" : "bg-pine-800"}`} />
                )}
              </div>
            ))}
          </div>

          {/* áudio */}
          <div className="flex items-center gap-3 rounded-xl bg-pine-900/80 p-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lime-400 text-pine-950">
              <PlayIcon />
            </span>
            <div className="flex h-9 flex-1 items-end gap-[3px]">
              {EQ.map((b, i) => (
                <span
                  key={i}
                  className={`w-[5px] origin-bottom rounded-t-full transition-colors duration-300 ${
                    phase === 0 ? "bg-lime-400 animate-eq" : "bg-pine-600"
                  }`}
                  style={{ height: `${b.h}%`, animationDelay: `${b.d}s` }}
                />
              ))}
            </div>
            <span className="shrink-0 font-mono text-[11px] text-pine-300 tnum">
              1:42
              <span className="block text-right text-[9.5px] uppercase text-pine-500">whatsapp</span>
            </span>
          </div>

          {/* transcrição */}
          <div className="min-h-[92px] rounded-xl border border-pine-800 bg-[#0d2318] p-4">
            {phase >= 1 ? (
              <div className="space-y-1.5">
                <p className="text-[13px] leading-snug text-paper animate-fade-up">
                  “Eu já liguei <mark className="rounded bg-coral-500/25 px-0.5 text-coral-300">três vezes</mark>. Nove dias que esse rastreio não mexe…”
                </p>
                <p className="text-[13px] leading-snug text-pine-200 animate-fade-up" style={{ animationDelay: "550ms" }}>
                  “…se ninguém me der uma posição hoje, eu <mark className="rounded bg-coral-500/25 px-0.5 text-coral-300">cancelo e nunca mais compro</mark>.”
                </p>
                <span className="mt-1 inline-block h-4 w-[7px] bg-lime-400 align-middle animate-caret" />
              </div>
            ) : (
              <p className="flex items-center gap-2 pt-2 font-mono text-[11.5px] text-pine-500">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-pine-700 border-t-lime-400" />
                {phase === 0 ? "transcrevendo áudio em pt-BR…" : ""}
              </p>
            )}
          </div>

          {/* classificação */}
          {phase >= 2 && (
            <div className="flex flex-wrap gap-2">
              {[
                ["sentimento: negativo", "bg-coral-500/15 text-coral-300 border-coral-500/40"],
                ["fricção: rastreio parado", "bg-honey-500/15 text-honey-400 border-honey-500/40"],
                ["risco de churn: alto", "bg-coral-500/15 text-coral-300 border-coral-500/40"],
                ["342 menções iguais", "bg-pine-800 text-pine-200 border-pine-700"],
              ].map(([t, c], i) => (
                <span
                  key={t}
                  className={`rounded-full border px-2.5 py-1 font-mono text-[10.5px] font-medium animate-fade-up ${c}`}
                  style={{ animationDelay: `${i * 130}ms` }}
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* diagnóstico */}
          {phase >= 3 && (
            <div className="rounded-xl border border-lime-400/40 bg-lime-400/10 p-4 animate-fade-up">
              <p className="flex items-center gap-2 font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-lime-300">
                <IconSpark className="h-3.5 w-3.5" /> diagnóstico da IA
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-paper">
                O gatilho não é o atraso — é o silêncio. Uma notificação proativa quando o rastreio
                parar por 72h eliminaria <strong className="text-lime-300">≈30% dos contatos de entrega</strong>.
              </p>
              <div className="mt-3 flex items-center justify-between font-mono text-[10.5px] text-pine-300">
                <span>economia estimada: R$ 4,8 mil/mês</span>
                <span className="text-lime-300">confiança 86%</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="mt-3 text-center font-mono text-[10.5px] text-ink-mute">
        simulação fiel do produto · um áudio real leva ~47s para virar diagnóstico
      </p>
    </div>
  );
}

/* --------------------------------- seções --------------------------------- */

const TICKER = [
  "“rastreio parado há 9 dias”",
  "“cupom diz que é inválido”",
  "“a etiqueta caiu no spam”",
  "“pagamento recusado sem motivo”",
  "“é a terceira vez que eu ligo”",
  "“vou registrar no Procon”",
  "“não compro mais de vocês”",
  "“ninguém me avisou do atraso”",
  "“responderam 6 dias depois”",
  "“no site funciona, no app não”",
];

function Ticker() {
  const items = [...TICKER, ...TICKER];
  return (
    <div className="relative border-y border-pine-800 bg-pine-950 py-4">
      <p className="pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-pine-700 bg-pine-900 px-3 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-lime-300">
        o que seu suporte ouve todo dia — e você não
      </p>
      <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
        <div className="flex w-max items-center gap-6 animate-marquee">
          {items.map((t, i) => (
            <span key={i} className="flex items-center gap-6 whitespace-nowrap">
              <span className="font-display text-[15px] font-semibold text-pine-200">{t}</span>
              <IconWave className="h-3.5 w-3.5 shrink-0 text-lime-400/70" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProblemSection() {
  return (
    <section id="problema" className="relative overflow-hidden bg-paper py-20 sm:py-24">
      <div className="bg-dots pointer-events-none absolute inset-0 opacity-50" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <Eyebrow>O custo do silêncio</Eyebrow>
          <h2 className="mt-3 max-w-3xl font-display text-3xl font-extrabold tracking-tight text-ink sm:text-[42px] sm:leading-[1.08]">
            O cliente reclama três vezes.
            <br />
            <span className="text-coral-600">A empresa escuta zero.</span>
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-12">
          <Reveal className="sm:col-span-7" delay={0}>
            <div className="flex h-full flex-col justify-between rounded-2xl border border-line bg-card p-7 transition-all duration-200 hover:-translate-y-1 hover:shadow-lift">
              <p className="font-display text-[64px] font-extrabold leading-none text-pine-800 sm:text-[84px]">
                <CountUp to={96} suffix="%" />
              </p>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft">
                dos clientes insatisfeitos <strong>não abrem chamado — só não voltam</strong>. O único
                aviso que você recebeu foi aquela conversa que ninguém leu até o fim.
              </p>
            </div>
          </Reveal>
          <div className="flex flex-col gap-4 sm:col-span-5">
            <Reveal delay={120}>
              <div className="rounded-2xl border border-line bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lift">
                <p className="font-display text-3xl font-extrabold text-ink">
                  até <CountUp to={15} /> pessoas
                </p>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-mute">
                  é para quem um cliente frustrado conta a experiência ruim. A maioria você nunca
                  chegou a conhecer.
                </p>
              </div>
            </Reveal>
            <Reveal delay={220}>
              <div className="rounded-2xl border border-line bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lift">
                <p className="font-display text-3xl font-extrabold text-ink">
                  <CountUp to={67} suffix="%" /> do churn
                </p>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-mute">
                  vem de falhas de atendimento, não de produto. O problema já está precificado — só
                  não está visível.
                </p>
              </div>
            </Reveal>
          </div>
          <Reveal className="sm:col-span-12" delay={160}>
            <div className="flex flex-col items-start gap-4 rounded-2xl border border-pine-200 bg-pine-50 p-7 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-2xl font-display text-xl font-bold leading-snug text-pine-900 sm:text-2xl">
                O problema não é falta de dado. É que <span className="underline decoration-lime-500 decoration-4 underline-offset-4">100% dele está preso dentro de conversas</span> — áudios, e-mails, chats que sua equipe arquiva e nunca mais reabre.
              </p>
              <div className="flex shrink-0 items-end gap-1" aria-hidden>
                {EQ.slice(0, 14).map((b, i) => (
                  <span key={i} className="w-1.5 rounded-t-full bg-pine-300" style={{ height: `${b.h * 0.6}%`, opacity: 0.4 + (i % 5) * 0.12 }} />
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function HowSection() {
  const steps = [
    {
      n: "01",
      icon: <IconWave className="h-5 w-5" />,
      title: "Envie o que você já tem",
      desc: "Áudios de WhatsApp, e-mails, exports de chat, planilhas de atendimento. Arraste, solte, pronto. Sem integração, sem projeto de TI, sem mais uma ferramenta para o time aprender.",
      tag: "setup em 7 dias",
    },
    {
      n: "02",
      icon: <IconMic className="h-5 w-5" />,
      title: "A IA ouve e cruza tudo",
      desc: "Transcreve áudio em português, lê e-mail e chat, classifica sentimento, agrupa por tema e compara cada conversa com o histórico inteiro da sua empresa — inclusive as fricções que ninguém tinha nomeado.",
      tag: "análise contínua",
    },
    {
      n: "03",
      icon: <IconTarget className="h-5 w-5" />,
      title: "Você decide com diagnóstico",
      desc: "Top fricções com evidências, pontos fortes do time, clientes em risco de churn, previsão de volume de contatos e um plano de ação priorizado por impacto. Toda semana, sem trabalho manual.",
      tag: "dashboard + relatórios",
    },
  ];
  return (
    <section id="como-funciona" className="relative bg-card py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <Eyebrow>Como funciona</Eyebrow>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-extrabold tracking-tight text-ink sm:text-[42px] sm:leading-[1.08]">
            Do arquivo bruto à decisão em <span className="text-pine-600">três movimentos</span>.
          </h2>
        </Reveal>

        <div className="relative mt-12 grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-8">
          <span className="absolute left-0 right-0 top-7 hidden h-px border-t-2 border-dashed border-pine-200 lg:block" aria-hidden />
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 140}>
              <div className="group relative">
                <div className="relative z-10 flex items-center gap-3">
                  <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-pine-950 text-lime-400 shadow-lift transition-transform duration-200 group-hover:-translate-y-1 group-hover:rotate-3">
                    {s.icon}
                  </span>
                  <span className="font-display text-4xl font-extrabold text-pine-200 transition-colors duration-200 group-hover:text-lime-500">
                    {s.n}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-ink">{s.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-mute">{s.desc}</p>
                <span className="mt-4 inline-block rounded-full border border-pine-200 bg-pine-50 px-3 py-1 font-mono text-[10.5px] font-medium uppercase tracking-wide text-pine-700">
                  {s.tag}
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <p className="mt-14 rounded-xl border border-lime-400/50 bg-lime-300/25 px-6 py-4 text-center text-[14.5px] font-medium text-pine-900">
            Na primeira semana você recebe o <strong>diagnóstico dos últimos 90 dias do seu suporte — de graça</strong>. Se ele não apontar economia mensurável, não fechamos negócio.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function ShowcaseSection() {
  const rows = [
    { t: "Rastreio parado sem aviso", m: 342, tr: 18, cat: "Logística" },
    { t: "Cupom recusado no checkout", m: 217, tr: 31, cat: "Pagamento" },
    { t: "Etiqueta de troca no spam", m: 164, tr: -12, cat: "Pós-venda" },
    { t: "Recusa de pagamento genérica", m: 148, tr: 9, cat: "Pagamento" },
  ];
  return (
    <section id="plataforma" className="relative overflow-hidden bg-pine-950 py-20 text-paper sm:py-24">
      <div className="bg-grid-dark pointer-events-none absolute inset-0" />
      <div className="glow-lime pointer-events-none absolute -left-32 top-24 h-[480px] w-[480px]" />
      <div className="glow-pine pointer-events-none absolute -right-32 bottom-0 h-[420px] w-[420px]" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <Eyebrow dark>A plataforma</Eyebrow>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-extrabold tracking-tight sm:text-[42px] sm:leading-[1.08]">
            Um diagnóstico vivo.
            <br />
            <span className="text-lime-400">Não um PDF que morre na gaveta.</span>
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-pine-200">
            Cada número do dashboard nasce de uma conversa real do seu suporte — com a evidência
            clicável, para você nunca mais decidir no “eu acho”.
          </p>
        </Reveal>

        <Reveal delay={150}>
          <div className="mt-12 overflow-hidden rounded-2xl border border-pine-800 bg-pine-900/70 shadow-lift-lg backdrop-blur-sm">
            <div className="flex flex-wrap items-center gap-4 border-b border-pine-800 px-5 py-3.5">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-coral-500" />
                <span className="h-2.5 w-2.5 rounded-full bg-honey-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-lime-400" />
              </div>
              <div className="flex gap-1.5">
                {["Visão geral", "Fricções", "Previsões"].map((t, i) => (
                  <span
                    key={t}
                    className={`rounded-md px-3 py-1 text-[11.5px] font-medium ${
                      i === 0 ? "bg-pine-800 text-lime-300" : "text-pine-400"
                    }`}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <span className="ml-auto font-mono text-[10.5px] text-pine-400 tnum">
                atualizado há 2 min · 1.284 conversas
              </span>
            </div>

            <div className="grid grid-cols-1 gap-px bg-pine-800/60 lg:grid-cols-12">
              {/* fricções */}
              <div className="bg-pine-900/90 p-6 lg:col-span-5">
                <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-pine-400">
                  Top pontos de fricção
                </p>
                <div className="mt-4 space-y-4">
                  {rows.map((r, i) => (
                    <Reveal key={r.t} delay={i * 100}>
                      <div className="group cursor-default">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="truncate text-[13px] font-semibold text-paper">{r.t}</p>
                          <span className={`flex shrink-0 items-center gap-1 font-mono text-[11px] tnum ${r.tr > 0 ? "text-coral-400" : "text-lime-300"}`}>
                            {r.tr > 0 ? <IconTrendUp className="h-3 w-3" /> : <IconTrendDown className="h-3 w-3" />}
                            {r.tr > 0 ? "+" : ""}{r.tr}%
                          </span>
                        </div>
                        <div className="mt-1.5 flex items-center gap-2">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-pine-800">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-pine-500 to-lime-400 transition-all duration-1000 group-hover:brightness-110"
                              style={{ width: `${(r.m / 342) * 100}%` }}
                            />
                          </div>
                          <span className="w-14 shrink-0 text-right font-mono text-[11px] text-pine-300 tnum">
                            {r.m} menç.
                          </span>
                        </div>
                        <p className="mt-1 font-mono text-[9.5px] uppercase tracking-wide text-pine-500">{r.cat}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>

              {/* sentimento */}
              <div className="bg-pine-900/90 p-6 lg:col-span-3">
                <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-pine-400">
                  Sentimento · semana
                </p>
                <p className="mt-5 font-display text-6xl font-extrabold text-lime-400">
                  <CountUp to={74} />
                </p>
                <p className="font-mono text-[10.5px] uppercase tracking-wide text-pine-400">CSAT estimado</p>
                <div className="mt-5 flex h-3 w-full overflow-hidden rounded-full">
                  <span className="w-[34%] bg-pine-400 transition-all duration-700 hover:brightness-110" />
                  <span className="w-[46%] bg-pine-700 transition-all duration-700 hover:brightness-125" />
                  <span className="w-[20%] bg-coral-500 transition-all duration-700 hover:brightness-110" />
                </div>
                <div className="mt-2.5 space-y-1 font-mono text-[10.5px] text-pine-300">
                  <p className="flex justify-between"><span className="text-pine-400">■ positivo</span> 437</p>
                  <p className="flex justify-between"><span className="text-pine-400">■ neutro</span> 462</p>
                  <p className="flex justify-between"><span className="text-pine-400">■ negativo</span> 219</p>
                </div>
              </div>

              {/* previsões */}
              <div className="bg-pine-900/90 p-6 lg:col-span-4">
                <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-pine-400">
                  Previsões & riscos
                </p>
                <div className="mt-4 space-y-3">
                  {[
                    { ic: <IconTrendUp className="h-4 w-4 text-honey-400" />, t: "+34% de contatos sobre entrega", s: "próximas 2 semanas · 86% conf." },
                    { ic: <IconX className="h-4 w-4 text-coral-400" />, t: "23 clientes com linguagem de churn", s: "contato ativo em 24h · 77% conf." },
                    { ic: <IconSpark className="h-4 w-4 text-lime-400" />, t: "CSAT 71 → 76 com rastreio proativo", s: "simulação · 30 dias · 68% conf." },
                  ].map((p, i) => (
                    <Reveal key={p.t} delay={i * 110}>
                      <div className="flex items-start gap-3 rounded-xl border border-pine-800 bg-pine-950/60 p-3.5 transition-colors hover:border-pine-700">
                        <span className="mt-0.5">{p.ic}</span>
                        <span>
                          <span className="block text-[13px] font-semibold leading-snug text-paper">{p.t}</span>
                          <span className="mt-0.5 block font-mono text-[10.5px] text-pine-400">{p.s}</span>
                        </span>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <p className="mt-4 text-center font-mono text-[10.5px] text-pine-500">
            dados ilustrativos do produto real — cada métrica remete a conversas analisadas, com evidência original
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function BeforeAfterSection() {
  const sem = [
    "Decisões tomadas no feeling e na última reunião",
    "A mesma reclamação volta todo mês, “do nada”",
    "Churn descoberto quando o cancelamento chega",
    "Relatório mensal montado à mão em 2 dias",
    "Elogios perdidos — o time bom não é visto",
  ];
  const com = [
    "Diagnóstico semanal automático, com evidências",
    "Fricção detectada nas primeiras menções",
    "Risco de churn sinalizado semanas antes",
    "Relatório executivo pronto em minutos",
    "Pontos fortes medidos e replicáveis",
  ];
  return (
    <section className="bg-paper py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <Eyebrow>Antes e depois</Eyebrow>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-extrabold tracking-tight text-ink sm:text-[42px] sm:leading-[1.08]">
            A mesma equipe. <span className="text-pine-600">Outra conversa com a diretoria.</span>
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl border border-line bg-card p-7">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-coral-600">
                Suporte sem a Escuta
              </p>
              <ul className="mt-5 space-y-4">
                {sem.map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full bg-coral-100 text-coral-600">
                      <IconX className="h-3 w-3" />
                    </span>
                    <span className="text-[14px] leading-snug text-ink-mute line-through decoration-coral-300/70 decoration-2">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={140}>
            <div className="relative h-full overflow-hidden rounded-2xl border border-pine-700 bg-pine-950 p-7 text-paper shadow-lift-lg">
              <div className="bg-grid-dark pointer-events-none absolute inset-0" />
              <div className="relative">
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-lime-400">
                  Suporte com a Escuta
                </p>
                <ul className="mt-5 space-y-4">
                  {com.map((t, i) => (
                    <li key={t} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full bg-lime-400 text-pine-950">
                        <IconCheck className="h-3 w-3" />
                      </span>
                      <span className="text-[14px] font-medium leading-snug animate-fade-up" style={{ animationDelay: `${i * 90}ms` }}>
                        {t}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ResultsSection() {
  const stats = [
    { v: <CountUp to={-31} prefix="" suffix="%" />, l: "contatos repetidos", s: "em 90 dias de uso" },
    { v: <CountUp to={3.2} decimals={1} suffix="×" />, l: "mais rápido à causa raiz", s: "vs. investigação manual" },
    { v: <CountUp to={92} suffix="%" />, l: "precisão no sentimento", s: "auditada contra humanos" },
    { v: <CountUp to={7} suffix=" dias" />, l: "até o 1º diagnóstico", s: "do primeiro upload" },
  ];
  return (
    <section id="resultados" className="border-y border-line bg-card py-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.l} delay={i * 110}>
              <div className="group text-center lg:text-left">
                <p className="font-display text-4xl font-extrabold tracking-tight text-pine-800 transition-colors duration-200 group-hover:text-pine-600 sm:text-5xl">
                  {s.v}
                </p>
                <p className="mt-2 text-[13.5px] font-semibold text-ink">{s.l}</p>
                <p className="font-mono text-[10.5px] uppercase tracking-wide text-ink-mute">{s.s}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden bg-paper py-20 sm:py-24">
      <div className="bg-dots pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <Eyebrow>Quem já ouve</Eyebrow>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-extrabold tracking-tight text-ink sm:text-[42px] sm:leading-[1.08]">
            Resultados contados pelos clientes. <span className="text-pine-600">Não por nós.</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          <Reveal delay={0}>
            <figure className="flex h-full flex-col justify-between rounded-2xl border border-line bg-card p-7 transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lift-lg">
              <div>
                <span className="font-display text-5xl font-extrabold leading-none text-lime-500">“</span>
                <blockquote className="mt-1 text-[15px] leading-relaxed text-ink-soft">
                  Em duas semanas a Escuta apontou que 62% dos nossos contatos de entrega vinham de
                  rastreio parado. Ativamos um alerta proativo e o volume{" "}
                  <strong className="text-ink">caiu 28% no mês seguinte</strong>.
                </blockquote>
              </div>
              <figcaption className="mt-6">
                <span className="mb-3 inline-block rounded-full bg-pine-100 px-3 py-1 font-mono text-[10.5px] font-semibold text-pine-700 tnum">
                  −28% contatos de entrega · 30 dias
                </span>
                <p className="text-[13.5px] font-bold text-ink">Renata M.</p>
                <p className="font-mono text-[10.5px] uppercase tracking-wide text-ink-mute">
                  Head de CX · e-commerce, 40 mil pedidos/mês
                </p>
              </figcaption>
            </figure>
          </Reveal>
          <Reveal delay={140} className="md:translate-y-8">
            <figure className="flex h-full flex-col justify-between rounded-2xl border border-pine-700 bg-pine-950 p-7 text-paper shadow-lift-lg transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lift-lg">
              <div>
                <span className="font-display text-5xl font-extrabold leading-none text-lime-400">“</span>
                <blockquote className="mt-1 text-[15px] leading-relaxed text-pine-100">
                  A IA achou um cupom mal configurado gerando <strong className="text-lime-300">90 chamados por quinzena</strong>.
                  Estava “escondido” nos e-mails havia três meses. Ninguém do time tinha visto.
                </blockquote>
              </div>
              <figcaption className="mt-6">
                <span className="mb-3 inline-block rounded-full bg-lime-400/15 px-3 py-1 font-mono text-[10.5px] font-semibold text-lime-300 tnum">
                  90 chamados/quinzena eliminados
                </span>
                <p className="text-[13.5px] font-bold">Carlos T.</p>
                <p className="font-mono text-[10.5px] uppercase tracking-wide text-pine-400">
                  COO · varejo digital
                </p>
              </figcaption>
            </figure>
          </Reveal>
          <Reveal delay={280} className="md:translate-y-16">
            <figure className="flex h-full flex-col justify-between rounded-2xl border border-line bg-card p-7 transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lift-lg">
              <div>
                <span className="font-display text-5xl font-extrabold leading-none text-lime-500">“</span>
                <blockquote className="mt-1 text-[15px] leading-relaxed text-ink-soft">
                  A diretoria parou de me cobrar relatório. Agora eu mando o diagnóstico da Escuta —
                  e ainda sobrou tempo para <strong className="text-ink">treinar o time nos pontos fortes</strong> que a IA mediu.
                </blockquote>
              </div>
              <figcaption className="mt-6">
                <span className="mb-3 inline-block rounded-full bg-pine-100 px-3 py-1 font-mono text-[10.5px] font-semibold text-pine-700 tnum">
                  relatório mensal: 4h → 12 min
                </span>
                <p className="text-[13.5px] font-bold text-ink">Juliana F.</p>
                <p className="font-mono text-[10.5px] uppercase tracking-wide text-ink-mute">
                  Gerente de Suporte · SaaS B2B
                </p>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function OfferSection() {
  const included = [
    "Diagnóstico dos últimos 90 dias do seu suporte — gratuito, antes de qualquer contrato",
    "Implementação acompanhada em 7 dias, sem projeto de TI",
    "Dashboard, alertas e relatórios executivos ilimitados",
    "Análise de áudios de WhatsApp, e-mails, chats e planilhas",
    "Preço fixo por 12 meses — sem reajuste, sem letra miúda",
    "Canal direto no WhatsApp com o fundador do produto",
  ];
  return (
    <section id="oferta" className="relative overflow-hidden bg-card py-20 sm:py-24">
      <div className="glow-pine pointer-events-none absolute -left-40 top-0 h-[520px] w-[520px]" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow>Programa Fundador</Eyebrow>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-[40px] sm:leading-[1.08]">
                Custa menos que <span className="text-coral-600">um mês de clientes indo embora calados</span>.
              </h2>
              <div className="mt-6 rounded-xl border border-coral-300/50 bg-coral-100/60 p-5">
                <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-coral-700">
                  Faça a conta do status quo
                </p>
                <p className="mt-3 font-mono text-[13px] leading-relaxed text-ink-soft tnum">
                  ticket médio R$ 180<br />
                  × 40 clientes que saem calados / mês<br />
                  × 12 meses<br />
                  <span className="mt-1 block font-display text-2xl font-extrabold text-coral-600">
                    = R$ 86.400 / ano vazando
                  </span>
                </p>
              </div>
              <div className="mt-6">
                <p className="mb-2 text-[12.5px] font-semibold text-ink-soft">Turma atual do programa fundador</p>
                <div className="h-3 w-full overflow-hidden rounded-full bg-line">
                  <div className="stripes-bar h-full w-[65%] rounded-full bg-pine-600" />
                </div>
                <p className="mt-2 font-mono text-[11.5px] text-ink-mute tnum">
                  13 de 20 vagas preenchidas · <strong className="text-coral-600">restam 7 neste trimestre</strong>
                </p>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={140}>
              <div className="relative overflow-hidden rounded-2xl border border-pine-700 bg-pine-950 p-7 text-paper shadow-lift-lg sm:p-9">
                <div className="bg-grid-dark pointer-events-none absolute inset-0" />
                <div className="glow-lime pointer-events-none absolute -right-20 -top-20 h-72 w-72" />
                <div className="relative">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-lime-400">
                      O que entra no programa
                    </p>
                    <span className="rounded-full border border-lime-400/50 bg-lime-400/10 px-3 py-1 font-mono text-[10.5px] font-semibold uppercase tracking-wide text-lime-300">
                      7 vagas restantes
                    </span>
                  </div>
                  <ul className="mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    {included.map((t, i) => (
                      <li key={t} className="flex items-start gap-2.5 text-[13.5px] leading-snug text-pine-100 animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime-400 text-pine-950">
                          <IconCheck className="h-3 w-3" />
                        </span>
                        {t}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 flex flex-wrap items-end gap-x-5 gap-y-2 border-t border-pine-800 pt-6">
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-wide text-pine-400 line-through">R$ 1.490/mês</p>
                      <p className="font-display text-5xl font-extrabold tracking-tight text-lime-400">
                        R$ 690<span className="text-xl font-bold text-pine-300">/mês</span>
                      </p>
                    </div>
                    <p className="max-w-[220px] font-mono text-[11px] leading-relaxed text-pine-300">
                      fixo por 12 meses<br />para as 20 empresas fundadoras
                    </p>
                    <div className="ml-auto">
                      <WaButton msg={WA_MSG_FUNDADOR} label="Garantir minha vaga de fundador" sub={WHATS_DISPLAY} />
                    </div>
                  </div>

                  <p className="mt-6 flex items-start gap-2 rounded-xl border border-pine-800 bg-pine-900/70 p-4 text-[12.5px] leading-relaxed text-pine-200">
                    <IconShield className="mt-0.5 h-4.5 w-4.5 shrink-0 text-lime-400" />
                    <span>
                      <strong className="text-paper">Risco zero:</strong> o diagnóstico inicial é gratuito. Se ele não
                      apontar economia mensurável para a sua operação, não fechamos negócio — e o
                      documento é seu, de qualquer forma.
                    </span>
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  const faqs = [
    {
      q: "Preciso trocar minha ferramenta de suporte ou CRM?",
      a: "Não. A Escuta trabalha com o que você já produz: áudios de WhatsApp, e-mails, exports do seu chat ou help desk e planilhas. Seu time não muda rotina — só sobe os arquivos. Quando fizer sentido, evoluímos para integração direta.",
    },
    {
      q: "Os dados dos meus clientes ficam seguros?",
      a: "Sim. Arquivos são processados criptografados, a chave de IA nunca fica exposta no navegador (vai para o servidor no deploy) e o produto nasce alinhado à LGPD: retenção configurável, anonimização opcional e dados sempre exportáveis.",
    },
    {
      q: "Funciona com áudio de WhatsApp?",
      a: "Funciona — é um dos pontos mais fortes. O Whisper transcreve em português (incluindo áudios rápidos e com gírias), a IA identifica tom, urgência e linguagem de churn em cada trecho, e cada assunto do áudio vira um insight separado.",
    },
    {
      q: "Em quanto tempo vejo resultado?",
      a: "O diagnóstico dos últimos 90 dias chega na primeira semana. O padrão que vemos: a primeira fricção acionável aparece já nesse diagnóstico — e a primeira economia mensurável, dentro do primeiro mês.",
    },
    {
      q: "E se não fizer sentido para a minha operação?",
      a: "Você não paga. O diagnóstico inicial é gratuito e sem compromisso: se os insights não apontarem economia ou melhoria clara, encerramos ali — e o relatório fica com você.",
    },
    {
      q: "Por que “vagas limitadas”?",
      a: "Porque o Programa Fundador inclui implementação acompanhada de perto e canal direto com o fundador. Para manter esse nível de atenção, entram 20 empresas por trimestre — nem uma a mais.",
    },
  ];
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="bg-paper py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal>
          <Eyebrow>Objeções honestas</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-[40px]">
            O que todo mundo pergunta <span className="text-pine-600">antes de chamar no WhatsApp</span>.
          </h2>
        </Reveal>
        <div className="mt-10 space-y-3">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 60}>
              <div
                className={`overflow-hidden rounded-xl border transition-all duration-200 ${
                  open === i ? "border-pine-300 bg-card shadow-lift" : "border-line bg-card hover:border-pine-200"
                }`}
              >
                <button
                  onClick={() => setOpen(open === i ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
                >
                  <span className={`text-[14.5px] font-semibold transition-colors ${open === i ? "text-pine-700" : "text-ink"}`}>
                    {f.q}
                  </span>
                  <IconChevron
                    className={`h-4.5 w-4.5 shrink-0 text-pine-500 transition-transform duration-300 ${
                      open === i ? "rotate-90" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    open === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-[13.5px] leading-relaxed text-ink-mute">{f.a}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-pine-950 py-24 text-paper sm:py-28">
      <div className="bg-grid-dark pointer-events-none absolute inset-0" />
      <div className="glow-lime pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[720px] -translate-x-1/2 -translate-y-1/2" />
      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        <Reveal>
          <div className="mx-auto mb-8 flex h-16 items-end justify-center gap-[5px]" aria-hidden>
            {EQ.slice(0, 17).map((b, i) => (
              <span key={i} className="w-1.5 origin-bottom rounded-t-full bg-lime-400/70 animate-eq" style={{ height: `${b.h}%`, animationDelay: `${b.d}s` }} />
            ))}
          </div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-5xl sm:leading-[1.06]">
            Enquanto você lê esta frase, um cliente está explicando pela{" "}
            <span className="text-lime-400">terceira vez o mesmo problema</span>.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[15.5px] leading-relaxed text-pine-200">
            A primeira análise é gratuita. A conversa começa no WhatsApp — com gente, não com
            formulário. E se o diagnóstico não mostrar economia, você não paga nada.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <WaButton msg={WA_MSG_DIAG} size="lg" label="Quero meu diagnóstico gratuito" sub={`resposta em até 1h útil · ${WHATS_DISPLAY}`} />
            <a
              href={wa(WA_MSG_DEMO)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-pine-700 px-6 py-4 text-sm font-semibold text-pine-100 transition-all duration-200 hover:-translate-y-0.5 hover:border-lime-400/60 hover:text-lime-300"
            >
              Ver a plataforma por dentro <IconArrowRight className="h-4 w-4" />
            </a>
          </div>
          <p className="mt-6 font-mono text-[10.5px] uppercase tracking-[0.16em] text-pine-500">
            sem cartão · sem contrato · sem “vou pensar e te retorno” da nossa parte
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------- página ---------------------------------- */

export default function LandingPage({ onEnter }: { onEnter: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    ["#problema", "O problema"],
    ["#como-funciona", "Como funciona"],
    ["#plataforma", "Plataforma"],
    ["#resultados", "Resultados"],
    ["#oferta", "Oferta"],
    ["#faq", "FAQ"],
  ] as const;

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* ------------------------------- navbar ------------------------------- */}
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
          scrolled ? "border-b border-line bg-paper/90 backdrop-blur-md shadow-lift" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <a href="#topo" className="flex items-center gap-2.5">
            <LogoMark className="h-8 w-8 text-pine-800" />
            <span className="font-display text-lg font-extrabold tracking-tight">Escuta</span>
          </a>
          <nav className="hidden items-center gap-6 lg:flex">
            {links.map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="text-[13px] font-medium text-ink-soft transition-colors hover:text-pine-700"
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={onEnter}
              className="hidden rounded-lg border border-line bg-card px-4 py-2 text-[13px] font-semibold text-ink transition-all duration-150 hover:-translate-y-0.5 hover:border-pine-300 hover:shadow-lift sm:inline-flex cursor-pointer"
            >
              Entrar no app
            </button>
            <a
              href={wa(WA_MSG_DIAG)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-pine-950 px-4 py-2 text-[13px] font-semibold text-lime-300 transition-all duration-150 hover:-translate-y-0.5 hover:bg-pine-900 hover:shadow-lift"
            >
              <WaIcon className="h-4 w-4" /> Falar no WhatsApp
            </a>
          </div>
        </div>
      </header>

      {/* --------------------------------- hero -------------------------------- */}
      <section id="topo" className="relative overflow-hidden pt-28 sm:pt-32">
        <div className="bg-dots pointer-events-none absolute inset-0 opacity-60" />
        <div className="glow-pine pointer-events-none absolute -left-40 -top-32 h-[560px] w-[560px]" />
        <div className="glow-lime pointer-events-none absolute -right-32 top-40 h-[420px] w-[420px]" />

        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-5 pb-16 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:pb-24">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-pine-200 bg-card px-3.5 py-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-pine-700">
                <IconWave className="h-3.5 w-3.5 text-pine-500" />
                inteligência de suporte com IA
              </p>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="mt-6 font-display text-[40px] font-extrabold leading-[1.03] tracking-tight sm:text-[56px]">
                Seus clientes já dizem
                <br />
                exatamente o que está errado.
                <br />
                <span className="relative inline-block text-pine-700">
                  Sua empresa é que não está ouvindo.
                  <svg viewBox="0 0 320 12" className="absolute -bottom-1.5 left-0 w-full text-lime-400" aria-hidden>
                    <path d="M3 9c60-6 200-8 314-4" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-7 max-w-lg text-[15.5px] leading-relaxed text-ink-soft">
                A Escuta lê cada áudio, e-mail e chat do seu suporte — e devolve o diagnóstico que
                nenhuma planilha mostra: <strong className="text-ink">as fricções que geram chamados</strong>, os
                clientes prestes a sair e as decisões que cortam custo. Toda semana, sem trabalho manual.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
                <WaButton msg={WA_MSG_DIAG} size="lg" label="Quero um diagnóstico do meu suporte" sub="grátis · resposta em até 1h útil" />
                <button
                  onClick={onEnter}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-card px-6 py-4 text-sm font-semibold text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-pine-300 hover:shadow-lift cursor-pointer"
                >
                  Ver a plataforma por dentro
                  <IconArrowRight className="h-4 w-4 text-pine-600 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </div>
            </Reveal>
            <Reveal delay={400}>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
                {[
                  ["Setup em 7 dias", <IconClock key="a" className="h-3.5 w-3.5" />],
                  ["Sem trocar de ferramenta", <IconDoc key="b" className="h-3.5 w-3.5" />],
                  ["LGPD desde o design", <IconShield key="c" className="h-3.5 w-3.5" />],
                ].map(([t, ic]) => (
                  <span key={t as string} className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-ink-mute">
                    <span className="text-pine-500">{ic}</span> {t as string}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-6">
            <Reveal delay={250}>
              <LiveAnalysis />
            </Reveal>
          </div>
        </div>
      </section>

      <Ticker />
      <ProblemSection />
      <HowSection />
      <ShowcaseSection />
      <BeforeAfterSection />
      <ResultsSection />
      <TestimonialsSection />
      <OfferSection />
      <FaqSection />
      <FinalCta />

      {/* --------------------------------- footer -------------------------------- */}
      <footer className="border-t border-pine-800 bg-pine-950 py-10 text-pine-300">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-5 sm:flex-row sm:px-8">
          <div className="flex items-center gap-2.5">
            <LogoMark className="h-7 w-7 text-lime-400" />
            <div>
              <p className="font-display text-base font-bold leading-none text-paper">Escuta</p>
              <p className="mt-0.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-pine-500">
                o suporte fala. a escuta traduz.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <button onClick={onEnter} className="text-[12.5px] font-medium text-pine-200 transition-colors hover:text-lime-300 cursor-pointer">
              Entrar no app
            </button>
            <a href={wa(WA_MSG_DIAG)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[12.5px] font-medium text-pine-200 transition-colors hover:text-lime-300">
              <WaIcon className="h-4 w-4" /> {WHATS_DISPLAY}
            </a>
          </div>
          <p className="font-mono text-[10.5px] text-pine-600">© 2026 Escuta · feito para quem resolve</p>
        </div>
      </footer>

      {/* --------------------------- whatsapp flutuante --------------------------- */}
      <a
        href={wa(WA_MSG_DIAG)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
        className="group fixed bottom-6 right-6 z-50 flex items-center gap-3"
      >
        <span className="hidden rounded-lg border border-line bg-card px-3.5 py-2 text-[12.5px] font-semibold text-ink shadow-lift transition-all duration-200 group-hover:-translate-x-1 sm:block">
          Diagnóstico gratuito →
        </span>
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-lime-400 text-pine-950 shadow-lift-lg transition-transform duration-200 group-hover:scale-110">
          <span className="absolute inset-0 rounded-full bg-lime-400 opacity-50 animate-ping [animation-duration:2.2s]" />
          <WaIcon className="relative h-7 w-7" />
        </span>
      </a>
    </div>
  );
}
