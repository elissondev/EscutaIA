import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useApp } from "../lib/store";
import { IconAlert, IconCheck, IconChat, IconDoc, IconMail, IconWave, IconX } from "./icons";
import type { FileKind, Sentiment } from "../lib/data";

/* ------------------------------- count-up ------------------------------- */

export function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    const from = prev.current;
    prev.current = target;
    if (from === target) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(from + (target - from) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

export function Spark({ points, className }: { points: number[]; className?: string }) {
  if (points.length < 2) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const w = 120;
  const h = 36;
  const step = w / (points.length - 1);
  const coords = points
    .map((p, i) => `${(i * step).toFixed(1)},${(h - 4 - ((p - min) / range) * (h - 8)).toFixed(1)}`)
    .join(" ");
  const last = coords.split(" ").pop()!.split(",");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className ?? "w-full h-9"} preserveAspectRatio="none">
      <polyline points={coords} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx={last[0]} cy={last[1]} r="2.6" fill="currentColor" />
    </svg>
  );
}

/* --------------------------------- botões -------------------------------- */

type BtnVariant = "primary" | "lime" | "outline" | "ghost" | "dark" | "danger";

export function Btn({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  onClick,
  type = "button",
}: {
  children: ReactNode;
  variant?: BtnVariant;
  size?: "sm" | "md";
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  const variants: Record<BtnVariant, string> = {
    primary:
      "bg-pine-700 text-paper hover:bg-pine-600 active:scale-[0.98] shadow-lift disabled:bg-pine-200 disabled:text-pine-500",
    lime: "bg-lime-400 text-pine-950 hover:bg-lime-300 active:scale-[0.98] shadow-lift font-semibold disabled:bg-line disabled:text-ink-mute",
    outline:
      "border border-line bg-card text-ink hover:border-pine-300 hover:bg-pine-50 active:scale-[0.98] disabled:opacity-50",
    ghost: "text-ink-soft hover:bg-pine-50 hover:text-ink active:scale-[0.98] disabled:opacity-40",
    dark: "bg-pine-950 text-paper hover:bg-pine-900 active:scale-[0.98] disabled:opacity-40",
    danger:
      "border border-coral-300 bg-coral-100 text-coral-700 hover:bg-coral-300/40 active:scale-[0.98]",
  };
  const sizes = { sm: "px-3 py-1.5 text-[13px] gap-1.5", md: "px-4 py-2.5 text-sm gap-2" };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150 cursor-pointer disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}

/* ---------------------------------- chips -------------------------------- */

export function Chip({
  tone = "neutral",
  children,
  className = "",
}: {
  tone?: "green" | "amber" | "coral" | "neutral" | "lime" | "pine" | "dark";
  children: ReactNode;
  className?: string;
}) {
  const tones = {
    green: "bg-pine-100 text-pine-700 border-pine-200",
    amber: "bg-honey-100 text-honey-700 border-honey-400/30",
    coral: "bg-coral-100 text-coral-700 border-coral-300/40",
    neutral: "bg-linesoft text-ink-soft border-line",
    lime: "bg-lime-300/50 text-pine-800 border-lime-400/50",
    pine: "bg-pine-800 text-pine-100 border-pine-700",
    dark: "bg-pine-950 text-lime-300 border-pine-900",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11.5px] font-medium leading-5 ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export const SentimentChip = ({ s }: { s: Sentiment }) => {
  const map: Record<Sentiment, { tone: "green" | "amber" | "coral"; dot: string }> = {
    positivo: { tone: "green", dot: "bg-pine-500" },
    neutro: { tone: "amber", dot: "bg-honey-500" },
    negativo: { tone: "coral", dot: "bg-coral-500" },
  };
  return (
    <Chip tone={map[s].tone}>
      <span className={`h-1.5 w-1.5 rounded-full ${map[s].dot}`} />
      {s}
    </Chip>
  );
};

export const KindIcon = ({ kind, className }: { kind: FileKind; className?: string }) => {
  const cls = className ?? "w-4.5 h-4.5";
  if (kind === "audio") return <IconWave className={cls} />;
  if (kind === "email") return <IconMail className={cls} />;
  if (kind === "documento") return <IconDoc className={cls} />;
  return <IconChat className={cls} />;
};

/* ---------------------------------- cards -------------------------------- */

export function Card({
  children,
  className = "",
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-line bg-card ${
        hover
          ? "transition-all duration-200 hover:-translate-y-0.5 hover:border-pine-200 hover:shadow-lift"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionHead({
  eyebrow,
  title,
  desc,
  right,
}: {
  eyebrow?: string;
  title: string;
  desc?: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && (
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-pine-500">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-lg font-bold tracking-tight text-ink sm:text-xl">{title}</h2>
        {desc && <p className="mt-0.5 max-w-xl text-[13.5px] text-ink-mute">{desc}</p>}
      </div>
      {right}
    </div>
  );
}

/* ------------------------------ segmented -------------------------------- */

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  dark = false,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  dark?: boolean;
}) {
  return (
    <div
      className={`inline-flex items-center gap-0.5 rounded-lg p-0.5 ${
        dark ? "bg-pine-900/70" : "border border-line bg-linesoft"
      }`}
    >
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`rounded-md px-3 py-1.5 text-[12.5px] font-medium transition-all duration-150 cursor-pointer ${
            value === o.value
              ? dark
                ? "bg-lime-400 text-pine-950 shadow-sm"
                : "bg-card text-ink shadow-sm border border-line"
              : dark
                ? "text-pine-200 hover:text-lime-300"
                : "text-ink-mute hover:text-ink"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* -------------------------------- inputs --------------------------------- */

export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | null;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12.5px] font-semibold text-ink-soft">{label}</span>
      {children}
      {error && <span className="mt-1 block text-[12px] text-coral-600">{error}</span>}
    </label>
  );
}

export const inputCls = (error?: string | null) =>
  `w-full rounded-lg border bg-card px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-mute/70 outline-none transition-all duration-150 focus:ring-2 ${
    error
      ? "border-coral-400 focus:border-coral-500 focus:ring-coral-400/25"
      : "border-line focus:border-pine-400 focus:ring-pine-400/20"
  }`;

/* ------------------------------ empty state ------------------------------ */

export function EmptyState({
  icon,
  title,
  desc,
  action,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line bg-card/60 px-6 py-14 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-pine-50 text-pine-500">
        {icon}
      </div>
      <h3 className="font-display text-base font-bold text-ink">{title}</h3>
      <p className="mt-1 max-w-sm text-[13.5px] text-ink-mute">{desc}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/* --------------------------------- modal --------------------------------- */

export function Modal({
  open,
  onClose,
  title,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-pine-950/55 p-4 backdrop-blur-[3px] animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`w-full ${wide ? "max-w-2xl" : "max-w-md"} rounded-xl border border-line bg-card shadow-lift-lg animate-fade-up`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-linesoft px-5 py-4">
          <h3 className="font-display text-base font-bold text-ink">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-ink-mute transition-colors hover:bg-linesoft hover:text-ink cursor-pointer"
          >
            <IconX className="h-4.5 w-4.5" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

/* --------------------------------- toasts -------------------------------- */

export function Toasts() {
  const { toasts, dismissToast } = useApp();
  if (toasts.length === 0) return null;
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[60] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2.5">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-start gap-3 rounded-xl border border-pine-800 bg-pine-950 px-4 py-3.5 text-paper shadow-lift-lg animate-slide-in"
        >
          <span
            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
              t.kind === "success"
                ? "bg-lime-400 text-pine-950"
                : t.kind === "error"
                  ? "bg-coral-500 text-paper"
                  : "bg-pine-700 text-lime-300"
            }`}
          >
            {t.kind === "error" ? (
              <IconAlert className="h-3.5 w-3.5" />
            ) : t.kind === "info" ? (
              <IconWave className="h-3.5 w-3.5" />
            ) : (
              <IconCheck className="h-3.5 w-3.5" />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] font-semibold leading-tight">{t.title}</p>
            {t.desc && <p className="mt-0.5 text-[12.5px] leading-snug text-pine-200">{t.desc}</p>}
          </div>
          <button
            onClick={() => dismissToast(t.id)}
            className="rounded p-1 text-pine-300 transition-colors hover:text-paper cursor-pointer"
          >
            <IconX className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------- progress -------------------------------- */

export function ProgressBar({ value, tone = "lime" }: { value: number; tone?: "lime" | "pine" }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-pine-100">
      <div
        className={`h-full rounded-full transition-[width] duration-300 ease-out ${
          tone === "lime" ? "bg-lime-500 stripes-bar" : "bg-pine-600"
        }`}
        style={{ width: `${Math.min(100, value)}%` }}
      />
    </div>
  );
}

export function LockedNote({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-honey-400/30 bg-honey-100/70 px-4 py-3.5">
      <IconAlert className="mt-0.5 h-4.5 w-4.5 shrink-0 text-honey-600" />
      <div>
        <p className="text-[13.5px] font-semibold text-honey-700">{title}</p>
        <p className="text-[12.5px] text-honey-600">{desc}</p>
      </div>
    </div>
  );
}
