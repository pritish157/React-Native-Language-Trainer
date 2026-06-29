import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ProgressState {
  xp: number;
  streak: number;
  completedLessonIds: string[];
  addXp: (amount: number) => void;
  setStreak: (amount: number) => void;
  completeLesson: (lessonId: string) => void;
  resetProgress: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      xp: 15,
      streak: 12,
      completedLessonIds: ["es-u1-l1", "es-u3-l1", "es-u3-l2"], // Seed with first Spanish lesson and Unit 3 lessons completed to match mockup

      addXp: (amount) => set((state) => ({ xp: state.xp + amount })),
      setStreak: (amount) => set({ streak: amount }),
      completeLesson: (lessonId) =>
        set((state) => {
          if (state.completedLessonIds.includes(lessonId)) {
            return state;
          }
          return {
            completedLessonIds: [...state.completedLessonIds, lessonId],
          };
        }),
      resetProgress: () =>
        set({
          xp: 15,
          streak: 12,
          completedLessonIds: ["es-u1-l1"],
        }),
    }),
    {
      name: "progress-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
