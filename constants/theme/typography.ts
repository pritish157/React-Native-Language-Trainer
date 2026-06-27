/**
 * Lingua Design System — Typography Tokens
 *
 * Font family names must match the keys used in `useFonts()` inside _layout.tsx.
 * The typography scale mirrors the design system spec exactly.
 */

export const fontFamily = {
  regular: "Poppins-Regular",
  medium: "Poppins-Medium",
  semiBold: "Poppins-SemiBold",
  bold: "Poppins-Bold",
} as const;

export type FontWeight = keyof typeof fontFamily;

/**
 * Typography scale — each entry maps to a BEM utility class
 * in global.css (e.g. `.text-style--h1`).
 */
export const typographyScale = {
  h1: {
    usage: "Page / Screen Title",
    fontSize: 32,
    fontFamily: fontFamily.bold,
    lineHeight: 1.2,
  },
  h2: {
    usage: "Section Title",
    fontSize: 24,
    fontFamily: fontFamily.semiBold,
    lineHeight: 1.3,
  },
  h3: {
    usage: "Card / Module Title",
    fontSize: 20,
    fontFamily: fontFamily.semiBold,
    lineHeight: 1.3,
  },
  h4: {
    usage: "Subheading",
    fontSize: 16,
    fontFamily: fontFamily.medium,
    lineHeight: 1.4,
  },
  bodyLarge: {
    usage: "Important content",
    fontSize: 16,
    fontFamily: fontFamily.regular,
    lineHeight: 1.6,
  },
  bodyMedium: {
    usage: "Body text",
    fontSize: 14,
    fontFamily: fontFamily.regular,
    lineHeight: 1.6,
  },
  bodySmall: {
    usage: "Supporting text",
    fontSize: 13,
    fontFamily: fontFamily.regular,
    lineHeight: 1.6,
  },
  caption: {
    usage: "Labels, meta text",
    fontSize: 11,
    fontFamily: fontFamily.regular,
    lineHeight: 1.4,
  },
} as const;

export type TypographyStyle = keyof typeof typographyScale;
