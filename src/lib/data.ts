export type Role = "admin" | "analyst" | "viewer";
export type Route = "dashboard" | "upload" | "inbox" | "insights" | "reports" | "team";
export type FileKind = "audio" | "email" | "chat" | "documento";
export type Sentiment = "positivo" | "neutro" | "negativo";
export type Impact = "alto" | "medio" | "baixo";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  company: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  kind: FileKind;
  customer: string;
  channel: string;
  date: string;
  sizeKB: number;
  duration?: string;
  sentiment: Sentiment;
  tags: string[];
  summary: string;
  excerpt: string;
  frictionId?: string;
}

export interface AnalysisJob {
  id: string;
  name: string;
  kind: FileKind;
  sizeKB: number;
  progress: number;
  /** Arquivo original em memória (não persistido) — usado pelo Whisper na análise real. */
  file?: File | null;
}

export interface FrictionPoint {
  id: string;
  title: string;
  category: string;
  mentions: number;
  trend: number;
  impact: Impact;
  insight: string;
  action: string;
  evidences: string[];
}

export interface StrengthPoint {
  id: string;
  title: string;
  score: number;
  detail: string;
  quote: string;
}

export interface Prediction {
  id: string;
  title: string;
  detail: string;
  confidence: number;
  horizon: string;
}

export interface Report {
  id: string;
  title: string;
  period: string;
  sections: string[];
  author: string;
  createdAt: string;
  content: string;
}

export interface Toast {
  id: string;
  kind: "success" | "error" | "info";
  title: string;
  desc?: string;
}

export const STAGES = [
  "Recebendo arquivo",
  "Extraindo conteúdo",
  "Classificando tema",
  "Analisando sentimento",
  "Detectando fricções",
  "Consolidando insights",
] as const;

export const uid = () =>
  `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const hoursAgo = (h: number) =>
  new Date(Date.now() - h * 3600_000).toISOString();

export const daysAgo = (d: number) => hoursAgo(d * 24);

export const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(new Date(iso));

export const fmtDateTime = (iso: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));

export const timeAgo = (iso: string) => {
  const mins = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60_000));
  if (mins < 60) return `há ${mins} min`;
  const h = Math.round(mins / 60);
  if (h < 24) return `há ${h} h`;
  const d = Math.round(h / 24);
  return d === 1 ? "ontem" : `há ${d} dias`;
};

export const KIND_META: Record<FileKind, { label: string; exts: string[] }> = {
  audio: { label: "Áudio", exts: ["mp3", "wav", "m4a", "ogg", "aac"] },
  email: { label: "E-mail", exts: ["eml", "msg"] },
  chat: { label: "Chat / Texto", exts: ["txt", "md", "json", "csv", "log"] },
  documento: { label: "Documento", exts: ["pdf", "doc", "docx", "xls", "xlsx"] },
};

export const kindFromName = (name: string): FileKind => {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const entry = (Object.keys(KIND_META) as FileKind[]).find((k) =>
    KIND_META[k].exts.includes(ext)
  );
  return entry ?? "chat";
};

/* ---------------------------------- seed ---------------------------------- */

export const seedUsers: User[] = [
  {
    id: "u-admin",
    name: "Marina Duarte",
    email: "admin@vetra.com.br",
    password: "demo123",
    role: "admin",
    company: "Vetra Commerce",
    createdAt: daysAgo(120),
  },
  {
    id: "u-analyst",
    name: "Rafael Lima",
    email: "analista@vetra.com.br",
    password: "demo123",
    role: "analyst",
    company: "Vetra Commerce",
    createdAt: daysAgo(88),
  },
  {
    id: "u-viewer",
    name: "Beatriz Souza",
    email: "diretoria@vetra.com.br",
    password: "demo123",
    role: "viewer",
    company: "Vetra Commerce",
    createdAt: daysAgo(30),
  },
];

export const ROLE_META: Record<Role, { label: string; desc: string }> = {
  admin: { label: "Administrador", desc: "Acesso total, gestão de equipe e dados" },
  analyst: { label: "Analista", desc: "Envia arquivos, gera relatórios e vê insights" },
  viewer: { label: "Visualização", desc: "Somente leitura de dashboards e insights" },
};

export const frictions: FrictionPoint[] = [
  {
    id: "f1",
    title: "Entrega atrasada após rastreio parado",
    category: "Logística",
    mentions: 342,
    trend: 18,
    impact: "alto",
    insight:
      "62% das menções acontecem depois de 5 dias com o rastreio sem atualização. O gatilho do contato não é o atraso em si, é a falta de comunicação proativa — o cliente descobre sozinho que o pedido parou.",
    action:
      "Disparar notificação automática quando o rastreio ficar 72h sem movimentação, com nova previsão e cupom de pedido de desculpas.",
    evidences: [
      "“Meu pedido aparece como 'em transporte' há 9 dias e ninguém me responde. Descobri pela transportadora que voltou pro centro de distribuição.”",
      "“Se vocês tivessem avisado do atraso, ok, eu entenderia. Mas fiquei sabendo porque fui atrás.”",
    ],
  },
  {
    id: "f2",
    title: "Cupom não aplica no checkout",
    category: "Pagamento",
    mentions: 217,
    trend: 31,
    impact: "alto",
    insight:
      "O erro se concentra no cupom BEMVINDO10 em contas com mais de 30 dias. A regra de elegibilidade não está visível na interface, então o cliente interpreta como falha — e 41% abandonam o carrinho na sequência.",
    action:
      "Exibir a regra do cupom antes da aplicação (“válido para primeira compra em até 30 dias”) e oferecer cupom alternativo automático quando recusado.",
    evidences: [
      "“Digitei o cupom do site de vocês e diz 'inválido'. Então pra que anunciam?”",
      "“Tentei 4 vezes, limpei cache, troquei de navegador. Desisti da compra.”",
    ],
  },
  {
    id: "f3",
    title: "Troca sem etiqueta de devolução",
    category: "Pós-venda",
    mentions: 164,
    trend: -12,
    impact: "medio",
    insight:
      "A etiqueta demora até 48h úteis para chegar por e-mail e cai na caixa de spam em 1 em cada 5 casos. Depois que o envio passou a ser confirmado por WhatsApp, as menções caíram 12% — sinal de que o canal certo resolve.",
    action:
      "Enviar a etiqueta também por WhatsApp e SMS, com código de rastreio reverso na mesma mensagem.",
    evidences: [
      "“Solicitei a troca na segunda e até agora nada da etiqueta. O prazo dos Correios tá correndo.”",
      "“A etiqueta chegou no spam, quase perdi o prazo de postagem.”",
    ],
  },
  {
    id: "f4",
    title: "Pagamento recusado sem motivo claro",
    category: "Pagamento",
    mentions: 148,
    trend: 9,
    impact: "medio",
    insight:
      "A mensagem genérica “pagamento não aprovado” gera retrabalho: 70% desses contatos terminam com o cliente descobrindo que era limite ou dados digitados. O antifraude responde por 22% das recusas legítimas.",
    action:
      "Detalhar o motivo da recusa (limite, dados, antifraude) e oferecer retry assistido com outro método na própria tela.",
    evidences: [
      "“Cartão com limite sobrando e a loja diz que não aprovou. Ninguém explica o motivo.”",
      "“Tive que ligar pro banco e descobri que foi o sistema de segurança de vocês.”",
    ],
  },
  {
    id: "f5",
    title: "Busca do app devolve resultado errado",
    category: "Produto digital",
    mentions: 96,
    trend: 4,
    impact: "baixo",
    insight:
      "Concentrado em Android 12–13, a busca ignora acentos e retorna produtos fora de estoque primeiro. Menções crescem 4% por quinzena junto com a base de usuários do app.",
    action:
      "Normalizar acentos no índice de busca e rebaixar automaticamente itens sem estoque.",
    evidences: [
      "“Pesquisei 'cafeteira' e o primeiro resultado é capinha de celular.”",
      "“Só acho o produto quando tiro o acento. No site funciona, no app não.”",
    ],
  },
];

export const strengths: StrengthPoint[] = [
  {
    id: "s1",
    title: "Resolução no primeiro contato",
    score: 78,
    detail:
      "78% dos atendimentos terminam sem retorno do cliente em 7 dias — 11 pts acima da média do setor detectada na base comparativa.",
    quote: "“Resolvi tudo numa mensagem só. Raríssimo hoje em dia.”",
  },
  {
    id: "s2",
    title: "Tom cordial e humano",
    score: 91,
    detail:
      "91% das transcrições apresentam linguagem empática. Elogios nominais a atendentes apareceram 57 vezes no trimestre.",
    quote: "“A atendente Camila foi um amor, explicou tudo com paciência.”",
  },
  {
    id: "s3",
    title: "Política de troca bem compreendida",
    score: 84,
    detail:
      "Quando a política é citada pelo atendente, a satisfação da conversa sobe para 4,6/5. O material de apoio está funcionando.",
    quote: "“Me mandaram o passo a passo da troca, super claro.”",
  },
  {
    id: "s4",
    title: "Velocidade de resposta no WhatsApp",
    score: 87,
    detail:
      "Mediana de 47 segundos no WhatsApp contra 6h no e-mail. O cliente percebe — e menciona — a diferença entre canais.",
    quote: "“Respondem no WhatsApp em segundos, impressionante.”",
  },
];

export const predictions: Prediction[] = [
  {
    id: "p1",
    title: "Pico de contatos sobre entrega",
    detail:
      "O modelo projeta +34% de contatos sobre atraso de entrega nas próximas duas semanas, puxado pelo volume promocional em SP e MG.",
    confidence: 86,
    horizon: "Próximas 2 semanas",
  },
  {
    id: "p2",
    title: "Cupom BEMVINDO10 vai gerar chamados",
    detail:
      "Se a regra de elegibilidade não for exibida, a campanha atual tende a gerar ~90 novos contatos de “cupom inválido” em 15 dias.",
    confidence: 72,
    horizon: "Próximos 15 dias",
  },
  {
    id: "p3",
    title: "CSAT reage a rastreio proativo",
    detail:
      "Simulação: ativando a notificação de rastreio parado, o CSAT tende a subir de 71 para ~76 pontos em um mês.",
    confidence: 68,
    horizon: "30 dias após ativar",
  },
  {
    id: "p4",
    title: "Risco de churn identificado",
    detail:
      "23 clientes usaram linguagem de cancelamento (“nunca mais compro”, “Procon”) nos últimos 30 dias. Priorizar contato ativo com esse grupo.",
    confidence: 77,
    horizon: "Ação imediata",
  },
];

export const weeks = [
  { week: "S01", pos: 312, neu: 458, neg: 168, csat: 66, tma: 13.2 },
  { week: "S02", pos: 328, neu: 449, neg: 176, csat: 67, tma: 12.8 },
  { week: "S03", pos: 341, neu: 470, neg: 171, csat: 69, tma: 12.1 },
  { week: "S04", pos: 336, neu: 465, neg: 190, csat: 68, tma: 12.6 },
  { week: "S05", pos: 359, neu: 452, neg: 187, csat: 70, tma: 11.4 },
  { week: "S06", pos: 372, neu: 468, neg: 195, csat: 71, tma: 11.1 },
  { week: "S07", pos: 365, neu: 447, neg: 204, csat: 69, tma: 11.8 },
  { week: "S08", pos: 391, neu: 461, neg: 212, csat: 70, tma: 10.6 },
  { week: "S09", pos: 404, neu: 455, neg: 208, csat: 72, tma: 10.2 },
  { week: "S10", pos: 398, neu: 449, neg: 221, csat: 71, tma: 10.9 },
  { week: "S11", pos: 425, neu: 458, neg: 226, csat: 73, tma: 9.8 },
  { week: "S12", pos: 437, neu: 462, neg: 219, csat: 74, tma: 9.4 },
];

export const seedConversations: Conversation[] = [
  {
    id: "c01",
    title: "Áudio — cliente irritado com rastreio parado há 9 dias",
    kind: "audio",
    customer: "Carlos Mendes",
    channel: "WhatsApp",
    date: hoursAgo(2),
    sizeKB: 842,
    duration: "1min 42s",
    sentiment: "negativo",
    tags: ["entrega", "rastreio", "logística"],
    summary:
      "Cliente relata pedido #84.213 parado há 9 dias sem atualização. Tom de voz alterado nos primeiros 40s, acalma após atendente confirmar estorno parcial. Fricção f1 detectada com alta confiança.",
    excerpt:
      "“Eu já liguei três vezes, moça. Nove dias que esse rastreio não mexe. Se ninguém me der uma posição hoje, eu cancelo e nunca mais compro.”",
    frictionId: "f1",
  },
  {
    id: "c02",
    title: "E-mail — cupom BEMVINDO10 recusado no checkout",
    kind: "email",
    customer: "Fernanda Alves",
    channel: "E-mail",
    date: hoursAgo(5),
    sizeKB: 96,
    sentiment: "negativo",
    tags: ["cupom", "checkout", "pagamento"],
    summary:
      "Cliente de conta antiga tentou usar o cupom de boas-vindas anunciado no site. Recebeu erro genérico e abandonou o carrinho de R$ 412. Fricção f2 confirmada pela terceira vez esta semana nesta conta-coorte.",
    excerpt:
      "“O site de vocês anuncia o cupom em todo lugar, mas na hora diz que é inválido. Se é pra cliente novo, avisem antes.”",
    frictionId: "f2",
  },
  {
    id: "c03",
    title: "Chat — troca de tamanho concluída em 4 minutos",
    kind: "chat",
    customer: "João Pedro Ramos",
    channel: "Chat do site",
    date: hoursAgo(7),
    sizeKB: 31,
    sentiment: "positivo",
    tags: ["troca", "pós-venda"],
    summary:
      "Troca de tamanho de calçado resolvida no primeiro contato, com etiqueta enviada no próprio chat. Cliente elogiou a rapidez. Reforça o ponto forte s3.",
    excerpt: "“Nossa, foi mais rápido que loja física. Obrigado!”",
  },
  {
    id: "c04",
    title: "Áudio — dúvida sobre prazo de reembolso",
    kind: "audio",
    customer: "Luciana Prado",
    channel: "WhatsApp",
    date: hoursAgo(11),
    sizeKB: 512,
    duration: "58s",
    sentiment: "neutro",
    tags: ["reembolso", "prazo"],
    summary:
      "Cliente pergunta o prazo do estorno após devolução confirmada. Atendente cita a política corretamente; cliente encerra satisfeita, mas sugere colocar o prazo no app.",
    excerpt: "“Só uma dúvida: o dinheiro cai em quantos dias depois que vocês recebem o produto?”",
  },
  {
    id: "c05",
    title: "E-mail — pagamento recusado sem explicação",
    kind: "email",
    customer: "Otávio Bragança",
    channel: "E-mail",
    date: hoursAgo(26),
    sizeKB: 88,
    sentiment: "negativo",
    tags: ["pagamento", "antifraude"],
    summary:
      "Dois cartões recusados com a mesma mensagem genérica. Investigação apontou bloqueio do antifraude por divergência de endereço. Cliente só descobriu após insistir. Fricção f4.",
    excerpt:
      "“Cartão com limite sobrando, dados corretos, e o site só repete ‘pagamento não aprovado’. Alguém pode me dizer o motivo?”",
    frictionId: "f4",
  },
  {
    id: "c06",
    title: "Transcrição — ligação de elogio à atendente Camila",
    kind: "documento",
    customer: "Regina Vasconcelos",
    channel: "Telefone",
    date: daysAgo(2),
    sizeKB: 214,
    sentiment: "positivo",
    tags: ["elogio", "atendimento"],
    summary:
      "Cliente ligou exclusivamente para elogiar o atendimento da Camila na resolução de um pedido extraviado. Menção nominal registrada no ranking de atendentes.",
    excerpt: "“Quero que fique registrado: a Camila resolveu em dez minutos o que a transportadora enrolou por duas semanas.”",
  },
  {
    id: "c07",
    title: "Chat — busca do app não acha ‘cafeteira’",
    kind: "chat",
    customer: "Diego Nascimento",
    channel: "ReclameAqui",
    date: daysAgo(2),
    sizeKB: 27,
    sentiment: "negativo",
    tags: ["app", "busca", "android"],
    summary:
      "Cliente em Android 13 relata que a busca ignora acentos e prioriza itens fora de estoque. Print anexado confirma o comportamento. Fricção f5.",
    excerpt: "“Pesquisei ‘cafeteira’ e apareceu capinha de celular primeiro. No site funciona, no app não.”",
    frictionId: "f5",
  },
  {
    id: "c08",
    title: "E-mail — etiqueta de troca caiu no spam",
    kind: "email",
    customer: "Patrícia Guedes",
    channel: "E-mail",
    date: daysAgo(3),
    sizeKB: 104,
    sentiment: "negativo",
    tags: ["troca", "etiqueta", "spam"],
    summary:
      "Etiqueta de devolução localizada na caixa de spam a 6h do fim do prazo de postagem. Cliente quase perde a troca. Padrão recorrente: 5º caso idêntico no mês. Fricção f3.",
    excerpt: "“Achei a etiqueta no spam faltando poucas horas pro prazo. Quase perdi minha troca por causa disso.”",
    frictionId: "f3",
  },
  {
    id: "c09",
    title: "Áudio — cliente VIP pedindo segunda via de nota",
    kind: "audio",
    customer: "Henrique Salles",
    channel: "WhatsApp",
    date: daysAgo(4),
    sizeKB: 356,
    duration: "41s",
    sentiment: "neutro",
    tags: ["nota fiscal", "segunda via"],
    summary:
      "Solicitação simples de segunda via de nota fiscal, resolvida em 3 minutos. Cliente da coorte VIP — 14 pedidos no ano, nenhum atrito registrado.",
    excerpt: "“Oi, preciso da nota do pedido de março pra lançar no financeiro da empresa, consegue me mandar?”",
  },
  {
    id: "c10",
    title: "Chat — pedido entregue antes do prazo elogiado",
    kind: "chat",
    customer: "Amanda Ribeiro",
    channel: "Instagram",
    date: daysAgo(5),
    sizeKB: 22,
    sentiment: "positivo",
    tags: ["entrega", "elogio"],
    summary:
      "Entrega chegou 2 dias antes do previsto e o cliente registrou elogio espontâneo. Contraponto positivo à fricção f1: quando o prazo é cumprido, a marca é citada.",
    excerpt: "“Chegou antes do prazo e super bem embalado. Virei cliente!”",
  },
  {
    id: "c11",
    title: "Documento — planilha de devoluções de janeiro",
    kind: "documento",
    customer: "Interno · Operações",
    channel: "Upload",
    date: daysAgo(6),
    sizeKB: 1820,
    sentiment: "neutro",
    tags: ["devoluções", "operacional"],
    summary:
      "Planilha consolidada de devoluções: 3,1% dos pedidos, concentradas em vestuário (tamanho). Cruzada com conversas, confirma que guia de medidas reduziria ~40 chamados/mês.",
    excerpt: "“Motivo predominante de devolução (54%): tamanho incompatível com a tabela do site.”",
  },
  {
    id: "c12",
    title: "E-mail — ameaça de Procon por atraso",
    kind: "email",
    customer: "Sérgio Tavares",
    channel: "E-mail",
    date: daysAgo(7),
    sizeKB: 76,
    sentiment: "negativo",
    tags: ["entrega", "escalonamento", "churn"],
    summary:
      "Cliente cita Procon e cancelamento definitivo após 12 dias de atraso. Classificado como risco de churn alto; encaminhado ao time de retenção. Fricção f1 em grau crítico.",
    excerpt:
      "“É a última vez que compro com vocês. Se não chegar até sexta, vou ao Procon e cancelo o cartão cadastrado.”",
    frictionId: "f1",
  },
];

/* ----------------------- pool usado pela IA simulada ---------------------- */

export const ANALYSIS_POOL: Omit<Conversation, "id" | "kind" | "sizeKB" | "date">[] = [
  {
    title: "Áudio — cobrança de posicionamento sobre entrega",
    customer: "Cliente identificado pela voz",
    channel: "WhatsApp",
    sentiment: "negativo",
    tags: ["entrega", "rastreio"],
    summary:
      "Tom elevado nos primeiros segundos, pedido de prazo definitivo. Padrão idêntico a 61% dos contatos da fricção de rastreio parado.",
    excerpt: "“Só preciso de uma data. Uma data que vocês cumpram.”",
    frictionId: "f1",
  },
  {
    title: "E-mail — tentativa de cupom com erro genérico",
    customer: "Cliente da coorte 30+ dias",
    channel: "E-mail",
    sentiment: "negativo",
    tags: ["cupom", "checkout"],
    summary:
      "Erro “cupom inválido” sem exibição da regra de elegibilidade. Alta aderência ao padrão da fricção f2.",
    excerpt: "“O banner promete 10%, o checkout nega. Qual dos dois está errado?”",
    frictionId: "f2",
  },
  {
    title: "Chat — solicitação resolvida no primeiro contato",
    customer: "Cliente recorrente",
    channel: "Chat do site",
    sentiment: "positivo",
    tags: ["resolução", "agilidade"],
    summary:
      "Fluxo limpo, sem escalonamento. Reforça o ponto forte de resolução no primeiro contato (78% da base).",
    excerpt: "“Perfeito, obrigado pela rapidez!”",
  },
  {
    title: "Áudio — dúvida sobre política de troca",
    customer: "Cliente primeira compra",
    channel: "Telefone",
    sentiment: "neutro",
    tags: ["troca", "política"],
    summary:
      "Atendente citou a política corretamente; sentimento evoluiu de ansioso para confiante ao longo da gravação.",
    excerpt: "“Então posso trocar em até 30 dias sem custo, certo?”",
  },
  {
    title: "E-mail — recusa de pagamento frustrante",
    customer: "Cliente com limite disponível",
    channel: "E-mail",
    sentiment: "negativo",
    tags: ["pagamento", "antifraude"],
    summary:
      "Mensagem genérica de recusa gerou 3 tentativas e abandono. Assinatura clássica da fricção f4.",
    excerpt: "“Três cartões diferentes e o mesmo erro sem explicação.”",
    frictionId: "f4",
  },
  {
    title: "Documento — consolidação de atendimentos da semana",
    customer: "Interno · Suporte",
    channel: "Upload",
    sentiment: "neutro",
    tags: ["operacional", "consolidado"],
    summary:
      "Documento processado e cruzado com a base: 68% dos itens mapeados em temas já conhecidos, 9% são menções novas a “frete caro”.",
    excerpt: "“Tema emergente detectado: reclamações de frete para região Norte (+22%).”",
  },
  {
    title: "Chat — elogio nominal a atendente",
    customer: "Cliente satisfeito",
    channel: "Instagram",
    sentiment: "positivo",
    tags: ["elogio", "atendimento"],
    summary:
      "Menção positiva nominal registrada no ranking de atendentes. Sinal de força no tom humano do time.",
    excerpt: "“A pessoa que me atendeu foi extremamente educada, parabéns à equipe.”",
  },
  {
    title: "Áudio — cliente cita cancelamento e Procon",
    customer: "Cliente em risco",
    channel: "WhatsApp",
    sentiment: "negativo",
    tags: ["churn", "escalonamento"],
    summary:
      "Linguagem de rompimento detectada com 91% de confiança. Recomendado contato ativo de retenção em até 24h.",
    excerpt: "“Do jeito que está, essa foi minha última compra com vocês.”",
    frictionId: "f1",
  },
];

export const sampleFiles = [
  { name: "whatsapp-cliente-4821.mp3", sizeKB: 743 },
  { name: "thread-cupom-invalido.eml", sizeKB: 112 },
  { name: "transcricao-ligacao-0912.txt", sizeKB: 38 },
  { name: "devolucoes-fevereiro.xlsx", sizeKB: 1564 },
];

export const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
