import { useState } from "react";
import type { ReactNode } from "react";
import { useApp } from "../lib/store";
import { ROLE_META, fmtDate } from "../lib/data";
import type { Role } from "../lib/data";
import { Btn, Card, Chip, EmptyState, Field, LockedNote, SectionHead, inputCls } from "./ui";
import { IconCheck, IconEye, IconPlus, IconShield, IconTeam, IconTrash, IconUpload, IconX } from "./icons";

const MATRIX: { label: string; icon: ReactNode; roles: [boolean, boolean, boolean] }[] = [
  { label: "Ver dashboards e insights", icon: <IconEye className="h-4 w-4" />, roles: [true, true, true] },
  { label: "Enviar arquivos para análise", icon: <IconUpload className="h-4 w-4" />, roles: [true, true, false] },
  { label: "Gerar e baixar relatórios", icon: <IconShield className="h-4 w-4" />, roles: [true, true, false] },
  { label: "Gerenciar equipe e excluir dados", icon: <IconTeam className="h-4 w-4" />, roles: [true, false, false] },
];

export default function TeamPage() {
  const { users, currentUser, permissions, setUserRole, removeUser, inviteUser } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("analyst");
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  if (!permissions.canTeam) {
    return (
      <div className="space-y-4">
        <LockedNote
          title="Gestão de equipe é restrita a Administradores"
          desc="Você pode ver quem faz parte do workspace, mas apenas um Administrador convida, remove ou muda papéis."
        />
        <Card className="p-5">
          <SectionHead eyebrow="Membros" title="Quem tem acesso" />
          <div className="mt-4 space-y-2">
            {users.map((u) => (
              <div key={u.id} className="flex items-center gap-3 rounded-lg border border-linesoft bg-paper/60 px-4 py-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-pine-100 font-display text-[12.5px] font-bold text-pine-700">
                  {u.name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-semibold text-ink">{u.name}</p>
                  <p className="truncate text-[12px] text-ink-mute">{u.email}</p>
                </div>
                <Chip tone={u.role === "admin" ? "dark" : u.role === "analyst" ? "green" : "neutral"}>
                  {ROLE_META[u.role].label}
                </Chip>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  const onInvite = () => {
    const e: Record<string, string | null> = {};
    if (name.trim().length < 2) e.name = "Informe o nome do membro.";
    if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Informe um e-mail válido.";
    const err = e.name || e.email ? null : inviteUser(name, email, role);
    if (err) e.email = err;
    setErrors(e);
    if (!e.name && !e.email) {
      setName("");
      setEmail("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        {/* convite */}
        <Card className="p-5 xl:col-span-2">
          <SectionHead eyebrow="Convite" title="Adicionar membro" desc="A pessoa entra com a senha provisória escuta123 e troca no primeiro acesso." />
          <div className="mt-4 space-y-4">
            <Field label="Nome" error={errors.name}>
              <input className={inputCls(errors.name)} placeholder="Novo colega" value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Field label="E-mail" error={errors.email}>
              <input className={inputCls(errors.email)} placeholder="colega@empresa.com.br" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
            <div>
              <p className="mb-1.5 text-[12.5px] font-semibold text-ink-soft">Nível de acesso</p>
              <div className="space-y-2">
                {(Object.keys(ROLE_META) as Role[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`flex w-full items-start gap-3 rounded-lg border px-3.5 py-2.5 text-left transition-all duration-150 cursor-pointer ${
                      role === r ? "border-pine-400 bg-pine-50 shadow-sm" : "border-line bg-card hover:border-pine-200"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border-2 ${
                        role === r ? "border-pine-600 bg-pine-600 text-paper" : "border-line"
                      }`}
                    >
                      {role === r && <IconCheck className="h-2.5 w-2.5" />}
                    </span>
                    <span>
                      <span className="block text-[13px] font-semibold text-ink">{ROLE_META[r].label}</span>
                      <span className="block text-[12px] text-ink-mute">{ROLE_META[r].desc}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <Btn className="w-full" onClick={onInvite}>
              <IconPlus className="h-4 w-4" /> Enviar convite
            </Btn>
          </div>
        </Card>

        {/* membros */}
        <div className="xl:col-span-3">
          <SectionHead
            eyebrow={`${users.length} membros`}
            title="Membros do workspace"
            desc="Mude o papel de qualquer pessoa — a interface dela se adapta na hora, em todas as páginas."
          />
          <div className="mt-4 space-y-2.5">
            {users.map((u, i) => (
              <Card key={u.id} hover className="flex flex-wrap items-center gap-3 p-4 animate-fade-up">
                <div style={{ animationDelay: `${i * 50}ms` }} className="animate-fade-up flex min-w-0 flex-1 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pine-950 font-display text-[13px] font-bold text-lime-300">
                    {u.name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-[13.5px] font-semibold text-ink">
                      <span className="truncate">{u.name}</span>
                      {u.id === currentUser?.id && <Chip tone="lime">você</Chip>}
                    </p>
                    <p className="truncate text-[12px] text-ink-mute">
                      {u.email} · desde {fmtDate(u.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <select
                    value={u.role}
                    onChange={(e) => setUserRole(u.id, e.target.value as Role)}
                    disabled={u.id === currentUser?.id}
                    className="rounded-lg border border-line bg-card px-2.5 py-1.5 text-[12.5px] font-medium text-ink outline-none transition-colors focus:border-pine-400 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                  >
                    {(Object.keys(ROLE_META) as Role[]).map((r) => (
                      <option key={r} value={r}>{ROLE_META[r].label}</option>
                    ))}
                  </select>
                  {u.id !== currentUser?.id && (
                    <button
                      onClick={() => removeUser(u.id)}
                      title="Remover do workspace"
                      className="rounded-md p-2 text-ink-mute transition-colors hover:bg-coral-100 hover:text-coral-600 cursor-pointer"
                    >
                      <IconTrash className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* matriz */}
          <Card className="mt-4 overflow-hidden">
            <div className="border-b border-linesoft px-5 py-4">
              <h3 className="font-display text-base font-bold text-ink">Matriz de permissões</h3>
              <p className="text-[12.5px] text-ink-mute">O que cada nível consegue fazer — aplicado em tempo real na interface.</p>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-linesoft bg-paper/70 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-mute">
                  <th className="px-5 py-2.5 font-medium">Capacidade</th>
                  {(Object.keys(ROLE_META) as Role[]).map((r) => (
                    <th key={r} className="px-3 py-2.5 text-center font-medium">{ROLE_META[r].label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MATRIX.map((row) => (
                  <tr key={row.label} className="border-b border-linesoft last:border-0">
                    <td className="flex items-center gap-2.5 px-5 py-3 text-[13px] font-medium text-ink">
                      <span className="text-pine-500">{row.icon}</span>
                      {row.label}
                    </td>
                    {row.roles.map((ok, i) => (
                      <td key={i} className="px-3 py-3 text-center">
                        {ok ? (
                          <IconCheck className="mx-auto h-4 w-4 text-pine-600" />
                        ) : (
                          <IconX className="mx-auto h-4 w-4 text-line" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {users.length === 1 && (
            <EmptyState
              icon={<IconTeam className="h-6 w-6" />}
              title="Só você por enquanto"
              desc="Convide analistas para alimentar a base com mais conversas e diretoria para acompanhar os indicadores."
            />
          )}
        </div>
      </div>
    </div>
  );
}
