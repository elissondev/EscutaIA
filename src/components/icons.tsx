import type { ReactNode } from "react";

interface IconProps {
  className?: string;
  strokeWidth?: number;
}

const base = (className?: string) => className ?? "w-5 h-5";

export const LogoMark = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 32" className={className ?? "w-8 h-8"} aria-hidden>
    <rect width="32" height="32" rx="9" fill="currentColor" opacity="0.14" />
    <g fill="currentColor">
      <rect x="6" y="13" width="2.6" height="6" rx="1.3" />
      <rect x="10.5" y="9" width="2.6" height="14" rx="1.3" />
      <rect x="15" y="5.5" width="2.6" height="21" rx="1.3" />
      <rect x="19.5" y="10" width="2.6" height="12" rx="1.3" />
      <rect x="24" y="14" width="2.6" height="4" rx="1.3" />
    </g>
  </svg>
);

const S = ({ className, strokeWidth = 1.8, children }: IconProps & { children: ReactNode }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={base(className)}
    aria-hidden
  >
    {children}
  </svg>
);

export const IconDashboard = (p: IconProps) => (
  <S {...p}>
    <rect x="3.5" y="3.5" width="7" height="9" rx="1.6" />
    <rect x="13.5" y="3.5" width="7" height="5.5" rx="1.6" />
    <rect x="13.5" y="12.5" width="7" height="8" rx="1.6" />
    <rect x="3.5" y="16" width="7" height="4.5" rx="1.6" />
  </S>
);

export const IconUpload = (p: IconProps) => (
  <S {...p}>
    <path d="M12 15V4.5" />
    <path d="m7.5 8.5 4.5-4.5 4.5 4.5" />
    <path d="M4 15.5v2.5a2.5 2.5 0 0 0 2.5 2.5h11A2.5 2.5 0 0 0 20 18v-2.5" />
  </S>
);

export const IconInbox = (p: IconProps) => (
  <S {...p}>
    <path d="M4 4.8A1.8 1.8 0 0 1 5.8 3h12.4A1.8 1.8 0 0 1 20 4.8V19a1.8 1.8 0 0 1-1.8 1.8H5.8A1.8 1.8 0 0 1 4 19V4.8Z" />
    <path d="M4 13h4.5l1.5 2.5h4L15.5 13H20" />
  </S>
);

export const IconSpark = (p: IconProps) => (
  <S {...p}>
    <path d="M12 3.5c.5 3.9 2.6 6 6.5 6.5-3.9.5-6 2.6-6.5 6.5-.5-3.9-2.6-6-6.5-6.5 3.9-.5 6-2.6 6.5-6.5Z" />
    <path d="M18.5 15.5c.3 1.9 1.2 2.9 3 3.2-1.8.3-2.7 1.3-3 3.2-.3-1.9-1.2-2.9-3-3.2 1.8-.3 2.7-1.3 3-3.2Z" />
  </S>
);

export const IconReport = (p: IconProps) => (
  <S {...p}>
    <path d="M6 3.5h8.5L19 8v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19V5a1.5 1.5 0 0 1 1-1.5Z" />
    <path d="M14.5 3.5V8H19" />
    <path d="M8.5 16.5v-3" />
    <path d="M11.75 16.5v-5.5" />
    <path d="M15 16.5v-4" />
  </S>
);

export const IconTeam = (p: IconProps) => (
  <S {...p}>
    <circle cx="9" cy="8.5" r="3.2" />
    <path d="M3.5 19.5c.6-3.2 2.7-5 5.5-5s4.9 1.8 5.5 5" />
    <path d="M15.5 5.7a3.2 3.2 0 0 1 0 5.6" />
    <path d="M17.6 14.9c1.6.8 2.6 2.4 2.9 4.6" />
  </S>
);

export const IconLogout = (p: IconProps) => (
  <S {...p}>
    <path d="M14 4H7.5A2.5 2.5 0 0 0 5 6.5v11A2.5 2.5 0 0 0 7.5 20H14" />
    <path d="M16 8.5 19.5 12 16 15.5" />
    <path d="M19.5 12H10" />
  </S>
);

export const IconWave = (p: IconProps) => (
  <S {...p}>
    <path d="M4 10v4" />
    <path d="M7.3 7v10" />
    <path d="M10.6 4.5v15" />
    <path d="M13.9 8v8" />
    <path d="M17.2 6v12" />
    <path d="M20.5 10.5v3" />
  </S>
);

export const IconMail = (p: IconProps) => (
  <S {...p}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
    <path d="m4.5 7.5 7.5 6 7.5-6" />
  </S>
);

export const IconChat = (p: IconProps) => (
  <S {...p}>
    <path d="M20 11.5a7.5 7.5 0 0 1-11 6.6L4 19.5l1.4-4.9A7.5 7.5 0 1 1 20 11.5Z" />
    <path d="M9 10.5h6" />
    <path d="M9 13.5h3.5" />
  </S>
);

export const IconDoc = (p: IconProps) => (
  <S {...p}>
    <path d="M6 3.5h8.5L19 8v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19V5a1.5 1.5 0 0 1 1-1.5Z" />
    <path d="M14.5 3.5V8H19" />
    <path d="M8.5 12h7" />
    <path d="M8.5 15.5h5" />
  </S>
);

export const IconSearch = (p: IconProps) => (
  <S {...p}>
    <circle cx="10.5" cy="10.5" r="6" />
    <path d="m19.5 19.5-4.7-4.7" />
  </S>
);

export const IconTrendUp = (p: IconProps) => (
  <S {...p}>
    <path d="m4 16 5-5 3.5 3.5L19.5 8" />
    <path d="M15 8h4.5V12.5" />
  </S>
);

export const IconTrendDown = (p: IconProps) => (
  <S {...p}>
    <path d="m4 8 5 5 3.5-3.5L19.5 16" />
    <path d="M15 16h4.5v-4.5" />
  </S>
);

export const IconCheck = (p: IconProps) => (
  <S {...p}>
    <path d="m4.5 12.5 5 5L19.5 6.5" />
  </S>
);

export const IconX = (p: IconProps) => (
  <S {...p}>
    <path d="m6 6 12 12" />
    <path d="M18 6 6 18" />
  </S>
);

export const IconLock = (p: IconProps) => (
  <S {...p}>
    <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    <path d="M12 14.5v2" />
  </S>
);

export const IconPlus = (p: IconProps) => (
  <S {...p}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </S>
);

export const IconDownload = (p: IconProps) => (
  <S {...p}>
    <path d="M12 4v10.5" />
    <path d="m7.5 10.5 4.5 4.5 4.5-4.5" />
    <path d="M4 16.5V18a2.5 2.5 0 0 0 2.5 2.5h11A2.5 2.5 0 0 0 20 18v-1.5" />
  </S>
);

export const IconClock = (p: IconProps) => (
  <S {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </S>
);

export const IconShield = (p: IconProps) => (
  <S {...p}>
    <path d="M12 3.5 5 6v5.2c0 4.5 2.9 7.7 7 9.3 4.1-1.6 7-4.8 7-9.3V6l-7-2.5Z" />
    <path d="m9 11.8 2.2 2.2L15.5 9.5" />
  </S>
);

export const IconAlert = (p: IconProps) => (
  <S {...p}>
    <path d="M12 4 2.8 19.5h18.4L12 4Z" />
    <path d="M12 10v4" />
    <path d="M12 16.8v.2" />
  </S>
);

export const IconTarget = (p: IconProps) => (
  <S {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="0.8" fill="currentColor" />
  </S>
);

export const IconChevron = (p: IconProps) => (
  <S {...p}>
    <path d="m8.5 5.5 6.5 6.5-6.5 6.5" />
  </S>
);

export const IconEye = (p: IconProps) => (
  <S {...p}>
    <path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="2.8" />
  </S>
);

export const IconTrash = (p: IconProps) => (
  <S {...p}>
    <path d="M4.5 6.5h15" />
    <path d="M9 6.5V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v1.5" />
    <path d="M6.5 6.5 7.3 19a1.8 1.8 0 0 0 1.8 1.7h5.8a1.8 1.8 0 0 0 1.8-1.7l.8-12.5" />
    <path d="M10 10.5v6" />
    <path d="M14 10.5v6" />
  </S>
);

export const IconArrowRight = (p: IconProps) => (
  <S {...p}>
    <path d="M4.5 12h15" />
    <path d="m13.5 6 6 6-6 6" />
  </S>
);

export const IconSettings = (p: IconProps) => (
  <S {...p}>
    <path d="M4 7.5h8.5" />
    <path d="M17.5 7.5H20" />
    <path d="M4 12h2.5" />
    <path d="M11.5 12H20" />
    <path d="M4 16.5h8.5" />
    <path d="M17.5 16.5H20" />
    <circle cx="15" cy="7.5" r="2" />
    <circle cx="9" cy="12" r="2" />
    <circle cx="15" cy="16.5" r="2" />
  </S>
);

export const IconMic = (p: IconProps) => (
  <S {...p}>
    <rect x="9" y="3.5" width="6" height="11" rx="3" />
    <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0" />
    <path d="M12 18v2.5" />
  </S>
);
