import type { ReactNode } from "react";
import { useApp } from "../lib/store";
import { ROLE_META } from "../lib/data";
import type { Route } from "../lib/data";
import {
  IconDashboard,
  IconInbox,
  IconLock,
  IconLogout,
  IconReport,
  IconSettings,
  IconSpark,
  IconTeam,
  IconUpload,
  LogoMark,
} from "./icons";
import { Chip } from "./ui";
import SettingsModal from "./SettingsModal";

const NAV: { route: Route; label: string; icon: (p: { className?: string }) => ReactNode; gated?: "upload" | "team" }[] = [
  { route: "dashboard", label: "Visão geral", icon: (p) => <IconDashboard {...p} /> },
  { route: "upload", label: "Enviar arquivos", icon: (p) => <IconUpload {...p} />, gated: "upload" },
  { route: "inbox", label: "Conversas", icon: (p) => <IconInbox {...p} /> },
  { route: "insights", label: "Insights da IA", icon: (p) => <IconSpark {...p} /> },
  { route: "reports", label: "Relatórios", icon: (p) => <IconReport {...p} /> },
  { route: "team", label: "Equipe", icon: (p) => <IconTeam {...p} />, gated: "team" },
];

const TITLES: Record<Route, { title: string; desc: string }> = {
  dashboard: { title: "Visão geral", desc: "Métricas, sentimento e fricções do seu suporte em tempo real." },
  upload: { title: "Enviar arquivos", desc: "Áudios, e-mails, chats e documentos entram no pipeline de análise da IA." },
  inbox: { title: "Conversas analisadas", desc: "Tudo o que a IA processou, com sentimento, tags e fricções detectadas." },
  insights: { title: "Insights da IA", desc: "Diagnósticos, pontos fortes, fricções e previsões com evidências." },
  reports: { title: "Relatórios", desc: "Compile os insights em relatórios executivos prontos para compartilhar." },
  team: { title: "Equipe", desc: "Gerencie membros e níveis de acesso do workspace." },
};

export default function AppShell({ children }: { children: ReactNode }) {
  const { route, setRoute, currentUser, logout, permissions, jobs, ai, setSettingsOpen } = useApp();
  if (!currentUser) return null;

  const engineLabel =
    ai.mode === "openai" && ai.apiKey.trim() ? ai.model.trim() || "gpt-4o-mini" : "simulado";

  const initials = currentUser.name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const isLocked = (item: (typeof NAV)[number]) =>
    (item.gated === "upload" && !permissions.canUpload) ||
    (item.gated === "team" && !permissions.canTeam);

  const navBtn = (item: (typeof NAV)[number], mobile = false) => {
    const active = route === item.route;
    const locked = isLocked(item);
    return (
      <button
        key={item.route}
        onClick={() => setRoute(item.route)}
        className={`group relative flex w-full items-center gap-3 rounded-lg transition-all duration-150 cursor-pointer ${
          mobile
            ? "shrink-0 px-3 py-1.5 text-[12.5px] font-medium"
            : "px-3.5 py-2.5 text-[13.5px] font-medium"
        } ${
          active
            ? mobile
              ? "bg-lime-400 text-pine-950"
              : "bg-pine-900 text-lime-300"
            : mobile
              ? "bg-pine-900/60 text-pine-200"
              : "text-pine-200 hover:bg-pine-900/70 hover:text-paper"
        } ${locked && !active ? "opacity-60" : ""}`}
      >
        {!mobile && active && (
          <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-lime-400" />
        )}
        {item.icon({ className: "h-[18px] w-[18px] shrink-0" })}
        {item.label}
        {locked && <IconLock className="ml-auto h-3.5 w-3.5 opacity-70" />}
        {!mobile && item.route === "upload" && jobs.length > 0 && (
          <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-lime-400 px-1.5 font-mono text-[10.5px] font-bold text-pine-950 tnum">
            {jobs.length}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="flex min-h-screen">
      {/* ------------------------------- sidebar ------------------------------ */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] flex-col bg-pine-950 lg:flex">
        <div className="relative flex items-center gap-3 px-5 pb-6 pt-6">
          <LogoMark className="h-9 w-9 text-lime-400" />
          <div>
            <p className="font-display text-lg font-bold leading-none tracking-tight text-paper">Escuta</p>
            <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-[0.14em] text-pine-400">
              {currentUser.company}
            </p>
          </div>
        </div>

        <div className="mx-4 mb-3 flex items-center gap-2 rounded-lg border border-pine-800 bg-pine-900/60 px-3 py-2.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-60 animate-pulse-dot" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-lime-400" />
          </span>
          <p className="text-[11.5px] font-medium leading-tight text-pine-200">
            IA ouvindo
            <span className="block text-[10.5px] text-pine-400">análise contínua ativa</span>
          </p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4">
          <p className="px-3.5 pb-2 pt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-pine-500">
            Navegação
          </p>
          {NAV.map((item) => navBtn(item))}
        </nav>

        <div className="border-t border-pine-900 p-4">
          <button
            onClick={() => setSettingsOpen(true)}
            title="Configurar motor de IA"
            className="mb-2 flex w-full items-center justify-between rounded-lg border border-pine-800 bg-pine-900/50 px-3 py-2 text-[12px] font-medium text-pine-200 transition-colors hover:bg-pine-900 hover:text-paper cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <IconSettings className="h-4 w-4 text-pine-400" /> Motor de IA
            </span>
            <span className="font-mono text-[10.5px] text-lime-300">{engineLabel}</span>
          </button>
          <div className="flex items-center gap-3 rounded-lg px-2 py-1.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-lime-400 font-display text-[13px] font-bold text-pine-950">
              {initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold leading-tight text-paper">
                {currentUser.name}
              </p>
              <p className="truncate text-[11px] leading-tight text-pine-400">
                {ROLE_META[currentUser.role].label}
              </p>
            </div>
            <button
              onClick={logout}
              title="Sair da conta"
              className="rounded-md p-2 text-pine-400 transition-colors hover:bg-pine-900 hover:text-coral-400 cursor-pointer"
            >
              <IconLogout className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>
      </aside>

      {/* ------------------------------- conteúdo ----------------------------- */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-[248px]">
        <header className="sticky top-0 z-30 border-b border-line bg-paper/85 backdrop-blur-md">
          <div className="flex items-center justify-between gap-4 px-5 pt-4 sm:px-8">
            <div className="flex items-center gap-2.5 lg:hidden">
              <LogoMark className="h-7 w-7 text-pine-800" />
              <p className="font-display text-base font-bold tracking-tight text-ink">Escuta</p>
            </div>
            <div className="hidden lg:block">
              <h1 className="font-display text-[22px] font-extrabold tracking-tight text-ink">
                {TITLES[route].title}
              </h1>
              <p className="text-[12.5px] text-ink-mute">{TITLES[route].desc}</p>
            </div>
            <div className="flex items-center gap-2.5">
              <Chip tone="dark" className="hidden sm:inline-flex">
                <IconSpark className="h-3 w-3" />
                {ai.mode === "openai" && ai.apiKey.trim() ? `IA · ${engineLabel}` : "IA simulada"}
              </Chip>
              <Chip tone="neutral">{currentUser.company}</Chip>
            </div>
          </div>
          <nav className="flex gap-1.5 overflow-x-auto px-5 py-3 lg:hidden">
            {NAV.map((item) => navBtn(item, true))}
          </nav>
        </header>

        <main className="flex-1 px-5 py-6 sm:px-8 sm:py-7">
          <div key={route} className="mx-auto max-w-[1180px] animate-fade-up">
            <div className="mb-6 lg:hidden">
              <h1 className="font-display text-xl font-extrabold tracking-tight text-ink">
                {TITLES[route].title}
              </h1>
              <p className="text-[12.5px] text-ink-mute">{TITLES[route].desc}</p>
            </div>
            {children}
          </div>
        </main>

        <footer className="border-t border-line px-5 py-4 sm:px-8">
          <p className="font-mono text-[10.5px] text-ink-mute">
            Escuta · demo funcional — auth e papéis locais (prontos p/ Supabase) · IA simulada com
            modo real opcional via chave OpenAI-compatível
          </p>
        </footer>
      </div>

      <SettingsModal />
    </div>
  );
}
