import { QuestionLevel } from "./schema";

export const TIMER_SECONDS = 20;
export const READ_LEAD_IN_SECONDS = 0;

export interface LevelConfig {
  id: QuestionLevel;
  label: string;
  stars: string;
  starCount: number;
  reward: string;
  description: string;
  theme: {
    accent: string;
    border: string;
    bgSubtle: string;
    text: string;
    badgeBg: string;
    badgeText: string;
    ringColor: string;
  };
}

export const LEVELS: Record<QuestionLevel, LevelConfig> = {
  easy: {
    id: "easy",
    label: "Mudah",
    stars: "⭐",
    starCount: 1,
    reward: "1 Kartu Profesi (ambil dari draw pile)",
    description: "Istilah umum & konsep dasar sehari-hari",
    theme: {
      accent: "#10b981",
      border: "border-emerald-500/40 hover:border-emerald-400",
      bgSubtle: "bg-emerald-950/20",
      text: "text-emerald-400",
      badgeBg: "bg-emerald-500/15",
      badgeText: "text-emerald-300 border-emerald-500/30",
      ringColor: "#10b981",
    },
  },
  medium: {
    id: "medium",
    label: "Sedang",
    stars: "⭐⭐",
    starCount: 2,
    reward: "1 kartu bebas (Profesi atau Aksi)",
    description: "Skenario tim & teknologi aplikasi",
    theme: {
      accent: "#f59e0b",
      border: "border-amber-500/40 hover:border-amber-400",
      bgSubtle: "bg-amber-950/20",
      text: "text-amber-400",
      badgeBg: "bg-amber-500/15",
      badgeText: "text-amber-300 border-amber-500/30",
      ringColor: "#f59e0b",
    },
  },
  hard: {
    id: "hard",
    label: "Sulit",
    stars: "⭐⭐⭐",
    starCount: 3,
    reward: "2 kartu bebas (Profesi dan/atau Aksi)",
    description: "Konsep arsitektur, keamanan & operasional",
    theme: {
      accent: "#f43f5e",
      border: "border-rose-500/40 hover:border-rose-400",
      bgSubtle: "bg-rose-950/20",
      text: "text-rose-400",
      badgeBg: "bg-rose-500/15",
      badgeText: "text-rose-300 border-rose-500/30",
      ringColor: "#f43f5e",
    },
  },
};

export const REWARDS: Record<QuestionLevel, string> = {
  easy: LEVELS.easy.reward,
  medium: LEVELS.medium.reward,
  hard: LEVELS.hard.reward,
};

export const STORAGE_KEYS = {
  deck: (level: QuestionLevel) => `itscard:deck:v1:${level}`,
  roundSession: "itscard:round:v1:current",
  soundEnabled: "itscard:settings:sound",
};

