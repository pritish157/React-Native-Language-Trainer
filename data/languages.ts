import { Language } from "@/types/learning";

export const languages: Language[] = [
  {
    id: "es",
    name: "Spanish",
    nativeName: "Español",
    flag: "🇪🇸",
    isActive: true,
    learnersCount: "28.4M learners",
  },
  {
    id: "fr",
    name: "French",
    nativeName: "Français",
    flag: "🇫🇷",
    isActive: true,
    learnersCount: "19.4M learners",
  },
  {
    id: "ja",
    name: "Japanese",
    nativeName: "日本語",
    flag: "🇯🇵",
    isActive: false, // For future release
    learnersCount: "12.7M learners",
  },
  {
    id: "ko",
    name: "Korean",
    nativeName: "한국어",
    flag: "🇰🇷",
    isActive: false, // For future release
    learnersCount: "9.3M learners",
  },
  {
    id: "de",
    name: "German",
    nativeName: "Deutsch",
    flag: "🇩🇪",
    isActive: false, // For future release
    learnersCount: "8.1M learners",
  },
  {
    id: "zh",
    name: "Chinese",
    nativeName: "中文",
    flag: "🇨🇳",
    isActive: false, // For future release
    learnersCount: "7.4M learners",
  },
];
