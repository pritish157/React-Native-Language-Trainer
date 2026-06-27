/**
 * Lingua Design System — Color Tokens
 *
 * Use these in JS/TS when you need raw hex values
 * (e.g. StatusBar, dynamic styles, platform-specific props).
 *
 * For NativeWind usage, prefer the Tailwind classes registered
 * in global.css (e.g. `bg-lingua-purple`, `text-error`).
 */

export const colors = {
  // ── Primary ────────────────────────────────────────────
  linguaPurple: "#6C4EF5",
  linguaDeepPurple: "#5B3BF6",
  linguaBlue: "#4D8BFF",
  linguaGreen: "#21C16B",

  // ── Semantic ───────────────────────────────────────────
  success: "#21C16B",
  warning: "#FFC800",
  streak: "#FF8A00",
  error: "#FF4D4F",
  info: "#4D8BFF",

  // ── Neutrals ──────────────────────────────────────────
  textPrimary: "#0D132B",
  textSecondary: "#6B7280",
  border: "#E5E7EB",
  surface: "#F6F7FB",
  background: "#FFFFFF",
} as const;

export type ColorToken = keyof typeof colors;
