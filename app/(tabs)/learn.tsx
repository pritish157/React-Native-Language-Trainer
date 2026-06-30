import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { useLanguageStore } from "@/store/useLanguageStore";
import { useProgressStore } from "@/store/useProgressStore";
import { images } from "@/constants/images";
import { languages } from "@/data/languages";
import { units } from "@/data/units";
import { lessons } from "@/data/lessons";

export default function LearnScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { selectedLanguageId } = useLanguageStore();
  const { completedLessonIds } = useProgressStore();

  // Selected Unit State: if null, show Units List
  const [activeUnitId, setActiveUnitId] = useState<string | null>(null);
  
  // Local state for bookmark toggling
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // Local state for Lessons / Practice toggle tab
  const [activeTab, setActiveTab] = useState<"lessons" | "practice">("lessons");

  // Get current active language
  const currentLanguage = useMemo(() => {
    return (
      languages.find((lang) => lang.id === selectedLanguageId) ||
      languages.find((lang) => lang.isActive) ||
      languages[0]
    );
  }, [selectedLanguageId]);

  // Find units for this language
  const languageUnits = useMemo(() => {
    return units.filter((unit) => unit.languageId === currentLanguage.id);
  }, [currentLanguage]);

  // Handle deep linking/routing param from Home Tab
  useEffect(() => {
    if (params.unitId && typeof params.unitId === "string") {
      setActiveUnitId(params.unitId);
    } else if (languageUnits.length > 0 && !activeUnitId) {
      // By default, if Spanish is selected and we want to show mockup, default to Unit 3
      const hasUnit3 = languageUnits.some((u) => u.id === "es-unit-3");
      if (currentLanguage.id === "es" && hasUnit3) {
        setActiveUnitId("es-unit-3");
      } else {
        setActiveUnitId(languageUnits[0].id);
      }
    }
  }, [params.unitId, languageUnits, currentLanguage, activeUnitId]);

  // Get currently active unit data
  const currentUnit = useMemo(() => {
    return languageUnits.find((u) => u.id === activeUnitId) || languageUnits[0] || null;
  }, [activeUnitId, languageUnits]);

  // Get lessons for this unit
  const unitLessons = useMemo(() => {
    if (!currentUnit) return [];
    return lessons.filter((l) => l.unitId === currentUnit.id);
  }, [currentUnit]);

  // Calculate completed lessons count for current unit
  const unitProgress = useMemo(() => {
    if (unitLessons.length === 0) return { completed: 0, total: 0 };
    const completed = unitLessons.filter((l) => completedLessonIds.includes(l.id)).length;
    return {
      completed,
      total: unitLessons.length,
    };
  }, [unitLessons, completedLessonIds]);

  // Compute lesson status dynamically
  const lessonsWithStatus = useMemo(() => {
    let foundInProgress = false;
    return unitLessons.map((lesson) => {
      const isCompleted = completedLessonIds.includes(lesson.id);
      let status: "completed" | "in_progress" | "locked" = "locked";

      if (isCompleted) {
        status = "completed";
      } else if (!foundInProgress) {
        status = "in_progress";
        foundInProgress = true;
      } else {
        status = "locked";
      }

      return {
        ...lesson,
        status,
      };
    });
  }, [unitLessons, completedLessonIds]);

  // Handle lesson click
  const handleLessonPress = (lesson: typeof lessonsWithStatus[0]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const isCompleted = lesson.status === "completed";

    Alert.alert(
      isCompleted ? "Review Lesson" : "Start Lesson",
      isCompleted
        ? `Would you like to review "${lesson.title}"?`
        : `Would you like to start "${lesson.title}"?\nGoal: ${lesson.goals[0] || "Practice speaking"}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: isCompleted ? "Review" : "Start",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.push(`/lesson/${lesson.id}`);
          },
        },
      ]
    );
  };

  const handleBookmarkPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsBookmarked(!isBookmarked);
  };

  const handleBackToUnits = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveUnitId(null);
  };

  // Render Unit List
  if (!activeUnitId || !currentUnit) {
    return (
      <SafeAreaView style={styles.safeArea}>
        {/* Units Header */}
        <View className="flex-row items-center justify-between pt-4 pb-4 px-6 border-b border-[#F3F4F6] bg-white">
          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.replace("/");
              }}
              className="w-10 h-10 rounded-full border border-border items-center justify-center active:bg-surface"
            >
              <Ionicons name="arrow-back" size={20} color="#0D132B" />
            </Pressable>
            <Text className="text-[20px] font-poppins-bold text-text-primary">
              {currentLanguage.name} Path
            </Text>
          </View>
          <Text className="text-[24px]">{currentLanguage.flag}</Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
          <Text className="text-[22px] font-poppins-bold text-text-primary mb-1">
            Choose a Unit
          </Text>
          <Text className="text-[14px] font-poppins text-text-secondary mb-6">
            Practice conversational exercises and build real fluency.
          </Text>

          {languageUnits.map((unit) => {
            const unitLessonsList = lessons.filter((l) => l.unitId === unit.id);
            const completedCount = unitLessonsList.filter((l) =>
              completedLessonIds.includes(l.id)
            ).length;
            const progressPercent =
              unitLessonsList.length > 0 ? (completedCount / unitLessonsList.length) * 100 : 0;

            return (
              <Pressable
                key={unit.id}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setActiveUnitId(unit.id);
                }}
                className="bg-white border border-[#E5E7EB] rounded-3xl p-5 mb-5 active:bg-[#FAF9FF]"
                style={styles.shadowSm}
              >
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-[#6C4EF5] font-poppins-bold text-[13px] uppercase tracking-wider">
                    Unit {unit.number}
                  </Text>
                  <Text className="text-text-secondary text-[13px] font-poppins-medium">
                    {completedCount} / {unitLessonsList.length} Lessons
                  </Text>
                </View>

                <Text className="text-[18px] font-poppins-bold text-text-primary mb-1">
                  {unit.title}
                </Text>
                <Text className="text-[14px] font-poppins text-text-secondary mb-4 leading-5">
                  {unit.description}
                </Text>

                {/* Progress bar */}
                <View className="w-full bg-[#E5E7EB] h-2 rounded-full overflow-hidden mb-1">
                  <View
                    className="bg-[#6C4EF5] h-full rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Render Lessons Screen matching mockup exactly
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ── TOP HEADER ── */}
      <View className="flex-row items-center justify-between pt-3 pb-3 px-5 bg-white z-10">
        <View className="flex-row items-center flex-1 pr-4">
          <Pressable
            onPress={handleBackToUnits}
            className="w-10 h-10 items-center justify-center rounded-full mr-2 active:bg-[#F3F4F6]"
          >
            <Ionicons name="chevron-back" size={24} color="#0D132B" />
          </Pressable>
          <View className="flex-1">
            <Text className="text-[19px] font-poppins-bold text-text-primary leading-6">
              {currentUnit.title}
            </Text>
            <Text className="text-[13px] font-poppins text-text-secondary mt-0.5">
              Unit {currentUnit.number} • {unitProgress.completed} / {unitProgress.total} lessons
            </Text>
          </View>
        </View>

        {/* Bookmark Icon */}
        <Pressable
          onPress={handleBookmarkPress}
          className="w-10 h-10 items-center justify-center rounded-full active:bg-[#F3F4F6]"
        >
          <Ionicons
            name={isBookmarked ? "bookmark" : "bookmark-outline"}
            size={24}
            color={isBookmarked ? "#FF8A00" : "#6B7280"}
          />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        className="bg-white flex-1"
      >
        {/* ── ILLUSTRATION BANNER ── */}
        <View className="relative w-full h-[220px]">
          <Image
            source={images.mascotCafe}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        {/* ── SEGMENTED TOGGLE (Lessons / Practice) ── */}
        <View className="px-6 relative z-20 mt-[-26px]">
          <View className="bg-[#FAF9FF] border border-[#ECE9FF] p-1 rounded-2xl flex-row shadow-sm">
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setActiveTab("lessons");
              }}
              className={`flex-1 py-3 rounded-xl items-center justify-center relative overflow-hidden ${
                activeTab === "lessons" ? "bg-white shadow-sm border border-[#ECE9FF]" : ""
              }`}
            >
              <Text
                className={`text-[15px] ${
                  activeTab === "lessons"
                    ? "font-poppins-semibold text-[#6C4EF5]"
                    : "font-poppins text-text-secondary"
                }`}
              >
                Lessons
              </Text>
              {activeTab === "lessons" && (
                <View className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#6C4EF5] rounded-full" />
              )}
            </Pressable>

            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setActiveTab("practice");
              }}
              className={`flex-1 py-3 rounded-xl items-center justify-center relative overflow-hidden ${
                activeTab === "practice" ? "bg-white shadow-sm border border-[#ECE9FF]" : ""
              }`}
            >
              <Text
                className={`text-[15px] ${
                  activeTab === "practice"
                    ? "font-poppins-semibold text-[#6C4EF5]"
                    : "font-poppins text-text-secondary"
                }`}
              >
                Practice
              </Text>
              {activeTab === "practice" && (
                <View className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#6C4EF5] rounded-full" />
              )}
            </Pressable>
          </View>
        </View>

        {/* ── LESSONS CONTENT ── */}
        {activeTab === "lessons" ? (
          <View className="px-6 pt-6">
            {lessonsWithStatus.map((lesson, idx) => {
              const lessonNumber = idx + 1;

              // Render Completed Card
              if (lesson.status === "completed") {
                return (
                  <Pressable
                    key={lesson.id}
                    onPress={() => handleLessonPress(lesson)}
                    className="bg-white border border-[#E5E7EB] rounded-3xl p-5 mb-4 flex-row items-center justify-between active:bg-[#FAF9FF]"
                    style={styles.shadowSm}
                  >
                    <View className="flex-1 pr-4">
                      <Text className="text-text-secondary text-[13px] font-poppins-semibold">
                        Lesson {lessonNumber}
                      </Text>
                      <Text className="text-text-primary text-[17px] font-poppins-bold mt-1">
                        {lesson.title}
                      </Text>
                    </View>
                    <Ionicons name="checkmark-circle" size={28} color="#21C16B" />
                  </Pressable>
                );
              }

              // Render In Progress Card
              if (lesson.status === "in_progress") {
                const lessonImage = lesson.image || images.cafeTable;
                return (
                  <Pressable
                    key={lesson.id}
                    onPress={() => handleLessonPress(lesson)}
                    className="bg-white border-2 border-[#6C4EF5] rounded-3xl p-5 mb-4 flex-row items-center justify-between shadow-md shadow-[#6C4EF5]/10 active:opacity-95"
                    style={{ backgroundColor: "#FAF9FF" }}
                  >
                    <View className="flex-1 pr-4">
                      <Text className="text-[#6C4EF5] text-[13px] font-poppins-bold">
                        Lesson {lessonNumber}
                      </Text>
                      <Text className="text-text-primary text-[17px] font-poppins-bold mt-1">
                        {lesson.title}
                      </Text>
                      <Text className="text-[#6C4EF5] text-[13px] font-poppins-bold mt-1.5">
                        In progress
                      </Text>
                    </View>
                    <Image
                      source={typeof lessonImage === "string" ? { uri: lessonImage } : lessonImage}
                      className="w-12 h-12"
                      resizeMode="contain"
                    />
                  </Pressable>
                );
              }

              // Render Locked Card
              return (
                <Pressable
                  key={lesson.id}
                  onPress={() => handleLessonPress(lesson)}
                  className="bg-white border border-[#E5E7EB] rounded-3xl p-5 mb-4 flex-row items-center justify-between active:bg-[#FAF9FF] opacity-90"
                  style={styles.shadowSm}
                >
                  <View className="flex-1 pr-4">
                    <Text className="text-text-secondary text-[13px] font-poppins">
                      Lesson {lessonNumber}
                    </Text>
                    <Text className="text-text-secondary text-[17px] font-poppins-bold mt-1">
                      {lesson.title}
                    </Text>
                    <Text className="text-text-secondary text-[13px] font-poppins mt-1">
                      0 / {lesson.activities?.length || 6} lessons
                    </Text>
                  </View>
                  <Ionicons name="lock-closed" size={22} color="#9CA3AF" />
                </Pressable>
              );
            })}
          </View>
        ) : (
          /* ── PRACTICE TAB CONTENT ── */
          <View className="px-6 pt-6 items-center justify-center mt-8">
            <View className="w-16 h-16 rounded-full bg-[#ECE9FF] items-center justify-center mb-4">
              <Ionicons name="fitness" size={30} color="#6C4EF5" />
            </View>
            <Text className="text-[20px] font-poppins-bold text-text-primary mb-2 text-center">
              Practice Room
            </Text>
            <Text className="text-[14px] font-poppins text-text-secondary text-center px-4 mb-6 leading-5">
              Review vocabulary, listen to dialogue snippets, and practice speaking tasks to strengthen your skills.
            </Text>
            
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                Alert.alert("Coming Soon", "Practice challenges are currently under development.");
              }}
              className="bg-[#6C4EF5] py-3.5 px-6 rounded-2xl active:opacity-90 shadow-md shadow-[#6C4EF5]/20"
            >
              <Text className="text-white font-poppins-bold text-[15px]">
                Start Quick Review
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  shadowSm: {
    shadowColor: "#0D132B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
});
