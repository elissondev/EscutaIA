import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import {
  ANALYSIS_POOL,
  ROLE_META,
  kindFromName,
  pick,
  sampleFiles,
  seedConversations,
  seedUsers,
  uid,
} from "./data";
import type {
  AnalysisJob,
  Conversation,
  Report,
  Role,
  Route,
  Toast,
  User,
} from "./data";

const LS = {
  users: "escuta:v1:users",
  session: "escuta:v1:session",
  conversations: "escuta:v1:conversations",
  reports: "escuta:v1:reports",
};

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota — ignora */
  }
}

interface AppContextValue {
  users: User[];
  currentUser: User | null;
  conversations: Conversation[];
  jobs: AnalysisJob[];
  reports: Report[];
  toasts: Toast[];
  route: Route;
  setRoute: (r: Route) => void;
  login: (email: string, password: string) => string | null;
  register: (name: string, email: string, company: string, password: string) => string | null;
  logout: () => void;
  submitFiles: (entries: { name: string; sizeKB: number }[]) => void;
  submitSamples: () => void;
  generateReport: (title: string, period: string, sections: string[]) => Report | null;
  deleteReport: (id: string) => void;
  setUserRole: (id: string, role: Role) => void;
  removeUser: (id: string) => void;
  inviteUser: (name: string, email: string, role: Role) => string | null;
  toast: (kind: Toast["kind"], title: string, desc?: string) => void;
  dismissToast: (id: string) => void;
  permissions: { canUpload: boolean; canTeam: boolean; canReport: boolean };
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp fora do AppProvider");
  return ctx;
}

const makeConversation = (job: AnalysisJob): Conversation => {
  const base = pick(ANALYSIS_POOL);
  return {
    ...base,
    id: uid(),
    kind: job.kind,
    sizeKB: job.sizeKB,
    date: new Date().toISOString(),
  };
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => load(LS.users, seedUsers));
  const [sessionId, setSessionId] = useState<string | null>(() =>
    load<string | null>(LS.session, null)
  );
  const [conversations, setConversations] = useState<Conversation[]>(() =>
    load(LS.conversations, seedConversations)
  );
  const [reports, setReports] = useState<Report[]>(() => load<Report[]>(LS.reports, []));
  const [jobs, setJobs] = useState<AnalysisJob[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [route, setRoute] = useState<Route>("dashboard");
  const timers = useRef<number[]>([]);

  useEffect(() => save(LS.users, users), [users]);
  useEffect(() => save(LS.session, sessionId), [sessionId]);
  useEffect(() => save(LS.conversations, conversations), [conversations]);
  useEffect(() => save(LS.reports, reports), [reports]);
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (kind: Toast["kind"], title: string, desc?: string) => {
      const id = uid();
      setToasts((prev) => [...prev.slice(-3), { id, kind, title, desc }]);
      const t = window.setTimeout(() => dismissToast(id), 5000);
      timers.current.push(t);
    },
    [dismissToast]
  );

  /* ------------------------- pipeline de análise ------------------------- */
  const hasJobs = jobs.length > 0;
  useEffect(() => {
    if (!hasJobs) return;
    const t = window.setInterval(() => {
      setJobs((prev) =>
        prev.map((j) => ({
          ...j,
          progress: Math.min(100, j.progress + 2 + Math.random() * 5.5),
        }))
      );
    }, 320);
    return () => window.clearInterval(t);
  }, [hasJobs]);

  useEffect(() => {
    const done = jobs.filter((j) => j.progress >= 100);
    if (done.length === 0) return;
    setJobs((prev) => prev.filter((j) => j.progress < 100));
    const convs = done.map(makeConversation);
    setConversations((prev) => [...convs, ...prev]);
    done.forEach((j) =>
      toast("success", "Análise concluída", `${j.name} processado pela IA.`)
    );
  }, [jobs, toast]);

  const submitFiles = useCallback(
    (entries: { name: string; sizeKB: number }[]) => {
      if (entries.length === 0) return;
      const newJobs: AnalysisJob[] = entries.map((e) => ({
        id: uid(),
        name: e.name,
        kind: kindFromName(e.name),
        sizeKB: e.sizeKB,
        progress: 0,
      }));
      setJobs((prev) => [...prev, ...newJobs]);
      toast(
        "info",
        `${entries.length} arquivo${entries.length > 1 ? "s" : ""} na fila`,
        "A IA iniciou o pipeline de análise."
      );
    },
    [toast]
  );

  const submitSamples = useCallback(() => {
    submitFiles(sampleFiles);
  }, [submitFiles]);

  /* ------------------------------ autenticação ---------------------------- */
  const currentUser = users.find((u) => u.id === sessionId) ?? null;

  const login = useCallback(
    (email: string, password: string): string | null => {
      const user = users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );
      if (!user) return "Não encontramos uma conta com esse e-mail.";
      if (user.password !== password) return "Senha incorreta. Tente novamente.";
      setSessionId(user.id);
      setRoute("dashboard");
      toast("success", `Bem-vinda de volta, ${user.name.split(" ")[0]}!`, ROLE_META[user.role].label);
      return null;
    },
    [users, toast]
  );

  const register = useCallback(
    (name: string, email: string, company: string, password: string): string | null => {
      const exists = users.some(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );
      if (exists) return "Já existe uma conta com esse e-mail.";
      const user: User = {
        id: uid(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: "admin",
        company: company.trim() || "Minha empresa",
        createdAt: new Date().toISOString(),
      };
      setUsers((prev) => [...prev, user]);
      setSessionId(user.id);
      setRoute("dashboard");
      toast("success", "Conta criada!", "Você é o administrador do seu workspace.");
      return null;
    },
    [users, toast]
  );

  const logout = useCallback(() => {
    setSessionId(null);
  }, []);

  /* -------------------------------- relatórios ---------------------------- */
  const generateReport = useCallback(
    (title: string, period: string, sections: string[]): Report | null => {
      if (!currentUser) return null;
      const now = new Date();
      const neg = conversations.filter((c) => c.sentiment === "negativo").length;
      const pos = conversations.filter((c) => c.sentiment === "positivo").length;
      const lines: string[] = [
        `# ${title}`,
        ``,
        `> Gerado pelo **Escuta** em ${now.toLocaleDateString("pt-BR")} às ${now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })} · Autor: ${currentUser.name} · Período: ${period}`,
        ``,
      ];
      if (sections.includes("resumo")) {
        lines.push(
          `## Resumo executivo`,
          ``,
          `- **${conversations.length} conversas** analisadas no workspace (áudio, e-mail, chat e documentos).`,
          `- Sentimento: ${pos} positivas · ${conversations.length - pos - neg} neutras · ${neg} negativas.`,
          `- CSAT médio estimado: 71 pts (tendência de alta de 8 pts no trimestre).`,
          `- Tempo médio de primeira resposta: 11,2 min.`,
          ``
        );
      }
      if (sections.includes("friccoes")) {
        lines.push(`## Top pontos de fricção`, ``);
        [
          ["1", "Entrega atrasada após rastreio parado", "342 menções · +18%"],
          ["2", "Cupom não aplica no checkout", "217 menções · +31%"],
          ["3", "Troca sem etiqueta de devolução", "164 menções · -12%"],
          ["4", "Pagamento recusado sem motivo claro", "148 menções · +9%"],
        ].forEach(([n, t, m]) => lines.push(`${n}. **${t}** — ${m}`));
        lines.push(``);
      }
      if (sections.includes("fortes")) {
        lines.push(
          `## Pontos fortes`,
          ``,
          `- Resolução no primeiro contato: 78% dos atendimentos.`,
          `- Tom cordial e humano: 91% das transcrições.`,
          `- Velocidade de resposta no WhatsApp: mediana de 47s.`,
          ``
        );
      }
      if (sections.includes("previsoes")) {
        lines.push(
          `## Previsões da IA`,
          ``,
          `- **+34% de contatos sobre entrega** nas próximas 2 semanas (confiança 86%).`,
          `- Cupom BEMVINDO10 deve gerar ~90 chamados em 15 dias (confiança 72%).`,
          `- 23 clientes em risco de churn — contato ativo recomendado (confiança 77%).`,
          ``
        );
      }
      if (sections.includes("plano")) {
        lines.push(
          `## Plano de ação sugerido`,
          ``,
          `| Prioridade | Ação | Impacto esperado |`,
          `|---|---|---|`,
          `| P0 | Notificação proativa de rastreio parado (72h) | -30% contatos de entrega |`,
          `| P0 | Exibir regra do cupom antes da aplicação | -40% contatos de cupom |`,
          `| P1 | Etiqueta de troca via WhatsApp + SMS | -50% perda de prazo |`,
          `| P1 | Motivo detalhado na recusa de pagamento | -70% retrabalho |`,
          `| P2 | Normalizar acentos na busca do app | CSAT do app +3 pts |`,
          ``
        );
      }
      const content = lines.join("\n");
      const report: Report = {
        id: uid(),
        title,
        period,
        sections,
        author: currentUser.name,
        createdAt: now.toISOString(),
        content,
      };
      setReports((prev) => [report, ...prev]);
      return report;
    },
    [currentUser, conversations]
  );

  const deleteReport = useCallback((id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
  }, []);

  /* ------------------------------ equipe ---------------------------------- */
  const setUserRole = useCallback(
    (id: string, role: Role) => {
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
      const u = users.find((x) => x.id === id);
      if (u) toast("success", "Papel atualizado", `${u.name} agora é ${ROLE_META[role].label}.`);
    },
    [users, toast]
  );

  const removeUser = useCallback(
    (id: string) => {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast("info", "Membro removido do workspace.");
    },
    [toast]
  );

  const inviteUser = useCallback(
    (name: string, email: string, role: Role): string | null => {
      const exists = users.some(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );
      if (exists) return "Já existe um membro com esse e-mail.";
      setUsers((prev) => [
        ...prev,
        {
          id: uid(),
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password: "escuta123",
          role,
          company: currentUser?.company ?? "Minha empresa",
          createdAt: new Date().toISOString(),
        },
      ]);
      toast("success", "Convite enviado", `${email} entrou como ${ROLE_META[role].label}.`);
      return null;
    },
    [users, currentUser, toast]
  );

  const role = currentUser?.role ?? "viewer";
  const permissions = {
    canUpload: role !== "viewer",
    canTeam: role === "admin",
    canReport: role !== "viewer",
  };

  const value: AppContextValue = {
    users,
    currentUser,
    conversations,
    jobs,
    reports,
    toasts,
    route,
    setRoute,
    login,
    register,
    logout,
    submitFiles,
    submitSamples,
    generateReport,
    deleteReport,
    setUserRole,
    removeUser,
    inviteUser,
    toast,
    dismissToast,
    permissions,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
