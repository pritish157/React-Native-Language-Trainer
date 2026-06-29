import { Unit } from "@/types/learning";

export const units: Unit[] = [
  // ── Spanish Units ──────────────────────────────────────────
  {
    id: "es-unit-1",
    languageId: "es",
    number: 1,
    title: "Greetings & Basics",
    description: "Learn how to greet people, introduce yourself, and master essential vocabulary.",
  },
  {
    id: "es-unit-2",
    languageId: "es",
    number: 2,
    title: "At the Restaurant",
    description: "Order food and drinks, ask for the check, and talk about dining preferences.",
  },
  {
    id: "es-unit-3",
    languageId: "es",
    number: 3,
    title: "At the Café",
    description: "Order coffee, practice social conversations, and learn basic directions.",
  },

  // ── French Units ───────────────────────────────────────────
  {
    id: "fr-unit-1",
    languageId: "fr",
    number: 1,
    title: "First Conversations",
    description: "Get started with fundamental greetings and simple chat-based introductions.",
  },
];

/**
 * Helper to get units for a specific language
 */
export const getUnitsByLanguage = (languageId: string): Unit[] => {
  return units.filter((unit) => unit.languageId === languageId);
};
