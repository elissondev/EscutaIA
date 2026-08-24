import { useEffect, useState } from "react";
import { useApp } from "../lib/store";
import { Btn, Field, inputCls } from "./ui";
import { IconArrowRight, IconShield, IconSpark, LogoMark } from "./icons";

const rotatingInsights = [
  {
    kicker: "Fricção detectada",
    text: "Rastreio parado há 72h é o gatilho de 62% dos contatos sobre entrega.",
    metric: "342 menções · +18%",
    tone: "coral" as const,
  },
  {
    kicker: "Ponto forte",
    text: "78% dos atendimentos são resolvidos no primeiro contato — 11 pts acima do setor.",
    metric: "CSAT 74 · em alta",
    tone: "green" as const,
  },
  {
    kicker: "Previsão da IA",
    text: "Projeção de +34% de contatos sobre entrega nas próximas duas semanas.",
    metric: "confiança 86%",
    tone: "lime" as const,
  },
];

const demoAccounts = [
  { label: "Admin", email: "admin@vetra.com.br", desc: "acesso total" },
  { label: "Analista", email: "analista@vetra.com.br", desc: "envia e analisa" },
  { label: "Leitura", email: "diretoria@vetra.com.br", desc: "só visualiza" },
];

const eqBars = Array.from({ length: 26 }, (_, i) => ({
  h: 22 + Math.round(60 * Math.abs(Math.sin(i * 0.82))),
  d: (i % 7) * 0.13,
}));

export default function AuthScreen() {
  const { login, register } = useApp();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [busy, setBusy] = useState(false);
  const [insightIdx, setInsightIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setInsightIdx((i) => (i + 1) % rotatingInsights.length), 3800);
    return () => clearInterval(t);
  }, []);

  const validate = () => {
    const e: Record<string, string | null> = {};
    if (mode === "register" && name.trim().length < 2) e.name = "Informe seu nome completo.";
    if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Informe um e-mail válido.";
    if (password.length < 6) e.password = "A senha precisa de pelo menos 6 caracteres.";
    setErrors(e);
    return Object.values(e).every((v) => !v);
  };

  const submit = () => {
    if (!validate()) return;
    setBusy(true);
    setTimeout(() => {
      const err =
        mode === "login"
          ? login(email, password)
          : register(name, email, company, password);
      if (err) {
        setErrors({ form: err });
        setBusy(false);
      }
    }, 650);
  };

  const fillDemo = (demoEmail: string) => {
    setMode("login");
    setEmail(demoEmail);
    setPassword("demo123");
    setErrors({});
  };

  const insight = rotatingInsights[insightIdx];

  return (
    <div className="flex min-h-screen">
      {/* ------------------------- painel do produto ------------------------- */}
      <aside className="relative hidden w-[46%] max-w-[620px] flex-col justify-between overflow-hidden bg-pine-950 p-10 text-paper lg:flex">
        <div className="absolute inset-0 bg-grid-dark" />
        <div className="glow-lime pointer-events-none absolute -left-24 -top-24 h-[420px] w-[420px]" />
        <div className="glow-pine pointer-events-none absolute -bottom-32 -right-20 h-[460px] w-[460px]" />

        <div className="relative flex items-center gap-3">
          <LogoMark className="h-9 w-9 text-lime-400" />
          <div>
            <p className="font-display text-lg font-bold leading-none tracking-tight">Escuta</p>
            <p className="mt-0.5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-pine-300">
              inteligência de suporte
            </p>
          </div>
        </div>

        <div className="relative">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-lime-400">
            seu suporte fala todos os dias
          </p>
          <h1 className="mt-3 font-display text-[42px] font-extrabold leading-[1.04] tracking-tight">
            Cada áudio, e-mail e chat
            <br />
            vira <span className="text-lime-400">diagnóstico</span>.
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-pine-200">
            Envie as conversas do seu atendimento. A IA transcreve, classifica o sentimento,
            encontra os pontos de fricção e devolve métricas, previsões e um plano de ação.
          </p>

          {/* equalizer */}
          <div className="mt-8 flex h-16 items-end gap-[5px]" aria-hidden>
            {eqBars.map((b, i) => (
              <span
                key={i}
                className="w-[6px] origin-bottom rounded-t-full bg-lime-400/80 animate-eq"
                style={{ height: `${b.h}%`, animationDelay: `${b.d}s` }}
              />
            ))}
          </div>

          {/* insight rotativo */}
          <div className="mt-8 max-w-md">
            <div
              key={insightIdx}
              className="rounded-xl border border-pine-800 bg-pine-900/80 p-5 backdrop-blur-sm animate-fade-up"
            >
              <div className="flex items-center justify-between">
                <p
                  className={`font-mono text-[10.5px] uppercase tracking-[0.16em] ${
                    insight.tone === "coral"
                      ? "text-coral-400"
                      : insight.tone === "green"
                        ? "text-pine-300"
                        : "text-lime-400"
                  }`}
                >
                  {insight.kicker}
                </p>
                <IconSpark className="h-4 w-4 text-lime-400" />
              </div>
              <p className="mt-2 text-[14.5px] font-medium leading-snug text-paper">{insight.text}</p>
              <p className="mt-2.5 font-mono text-[11.5px] text-pine-300 tnum">{insight.metric}</p>
            </div>
            <div className="mt-3 flex gap-1.5">
              {rotatingInsights.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setInsightIdx(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    i === insightIdx ? "w-6 bg-lime-400" : "w-2.5 bg-pine-700 hover:bg-pine-600"
                  }`}
                  aria-label={`Insight ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        <p className="relative flex items-center gap-2 font-mono text-[11px] text-pine-400">
          <IconShield className="h-4 w-4 text-pine-300" />
          Fluxo de auth e papéis espelhando Supabase Auth + RLS · dados de demonstração
        </p>
      </aside>

      {/* ------------------------------ formulário ---------------------------- */}
      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-5 py-10">
        <div className="bg-dots pointer-events-none absolute inset-0 opacity-60" />
        <div className="glow-pine pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px]" />

        <div className="relative w-full max-w-[420px] animate-fade-up">
          <div className="mb-7 flex items-center gap-2.5 lg:hidden">
            <LogoMark className="h-8 w-8 text-pine-800" />
            <p className="font-display text-xl font-bold tracking-tight text-ink">Escuta</p>
          </div>

          <h2 className="font-display text-[26px] font-extrabold tracking-tight text-ink">
            {mode === "login" ? "Entrar no workspace" : "Criar seu workspace"}
          </h2>
          <p className="mt-1 text-[13.5px] text-ink-mute">
            {mode === "login"
              ? "Acesse seus dashboards e insights de suporte."
              : "Você entra como administrador da sua empresa."}
          </p>

          <div className="mt-6 rounded-xl border border-line bg-card p-6 shadow-lift">
            <div className="mb-5 grid grid-cols-2 gap-1 rounded-lg border border-line bg-linesoft p-1">
              {(["login", "register"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMode(m);
                    setErrors({});
                  }}
                  className={`rounded-md py-2 text-[13px] font-semibold transition-all cursor-pointer ${
                    mode === m
                      ? "bg-card text-ink shadow-sm"
                      : "text-ink-mute hover:text-ink"
                  }`}
                >
                  {m === "login" ? "Entrar" : "Criar conta"}
                </button>
              ))}
            </div>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
            >
              {mode === "register" && (
                <>
                  <Field label="Nome completo" error={errors.name}>
                    <input
                      className={inputCls(errors.name)}
                      placeholder="Ana Ribeiro"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Field>
                  <Field label="Empresa">
                    <input
                      className={inputCls()}
                      placeholder="Acme Suporte Ltda."
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </Field>
                </>
              )}
              <Field label="E-mail corporativo" error={errors.email}>
                <input
                  className={inputCls(errors.email)}
                  placeholder="voce@empresa.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field label="Senha" error={errors.password}>
                <input
                  type="password"
                  className={inputCls(errors.password)}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>

              {errors.form && (
                <p className="rounded-lg border border-coral-300/40 bg-coral-100 px-3.5 py-2.5 text-[13px] font-medium text-coral-700 animate-fade-in">
                  {errors.form}
                </p>
              )}

              <Btn type="submit" className="w-full" disabled={busy}>
                {busy ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-paper/40 border-t-paper" />
                    Verificando…
                  </>
                ) : (
                  <>
                    {mode === "login" ? "Entrar" : "Criar workspace"}
                    <IconArrowRight className="h-4 w-4" />
                  </>
                )}
              </Btn>
            </form>
          </div>

          <div className="mt-5 rounded-xl border border-dashed border-pine-200 bg-pine-50/70 p-4">
            <p className="mb-2.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-pine-600">
              Perfis de demonstração · senha demo123
            </p>
            <div className="flex flex-wrap gap-2">
              {demoAccounts.map((d) => (
                <button
                  key={d.email}
                  onClick={() => fillDemo(d.email)}
                  className="group flex items-center gap-2 rounded-lg border border-line bg-card px-3 py-2 text-left transition-all duration-150 hover:-translate-y-0.5 hover:border-pine-300 hover:shadow-lift cursor-pointer"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-pine-800 font-mono text-[11px] font-bold text-lime-300">
                    {d.label[0]}
                  </span>
                  <span>
                    <span className="block text-[12.5px] font-semibold leading-tight text-ink">
                      {d.label}
                    </span>
                    <span className="block text-[11px] leading-tight text-ink-mute">{d.desc}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
