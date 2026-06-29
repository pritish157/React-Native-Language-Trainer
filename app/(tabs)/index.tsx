import React, { useMemo } from "react";
import { View, Text, Image, Pressable, ScrollView, Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { useLanguageStore } from "@/store/useLanguageStore";
import { useProgressStore } from "@/store/useProgressStore";
import { images } from "@/constants/images";
import { languages } from "@/data/languages";
import { units } from "@/data/units";
import { lessons } from "@/data/lessons";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { selectedLanguageId, setSelectedLanguageId } = useLanguageStore();
  const { xp, streak, completedLessonIds, addXp, completeLesson, resetProgress } = useProgressStore();

  // Find active language
  const currentLanguage = useMemo(() => {
    return languages.find((lang) => lang.id === selectedLanguageId) || languages[0];
  }, [selectedLanguageId]);

  // Find units for this language
  const languageUnits = useMemo(() => {
    return units.filter((unit) => unit.languageId === currentLanguage.id);
  }, [currentLanguage]);

  const currentUnit = useMemo(() => {
    return languageUnits[0] || {
      id: "es-unit-1",
      number: 1,
      title: "Greetings & Basics",
      description: "",
    };
  }, [languageUnits]);

  // Find lessons for this unit
  const unitLessons = useMemo(() => {
    return lessons.filter((lesson) => lesson.unitId === currentUnit.id);
  }, [currentUnit]);

  // Personalized Greeting localized to selected language
  const greetingText = useMemo(() => {
    const name = user?.firstName || user?.username || user?.emailAddresses[0]?.emailAddress?.split("@")[0] || "Learner";
    switch (currentLanguage.id) {
      case "es":
        return `Hola, ${name}! 👋`;
      case "fr":
        return `Bonjour, ${name}! 👋`;
      case "zh":
        return `你好, ${name}! 👋`;
      case "de":
        return `Hallo, ${name}! 👋`;
      case "ja":
        return `こんにちは, ${name}! 👋`;
      case "ko":
        return `안녕하세요, ${name}! 👋`;
      default:
        return `Hello, ${name}! 👋`;
    }
  }, [currentLanguage, user]);

  // Custom teacher avatar placeholder (Unsplash friendly teacher portrait)
  const teacherAvatarUrl = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop";

  // Today's plan list (map lessons or generate placeholders)
  const planItems = useMemo(() => {
    const items = [];
    
    // Item 1: Lesson
    const l1 = unitLessons[0];
    items.push({
      id: l1?.id || "lesson-1",
      category: "Lesson",
      title: l1?.title || (currentLanguage.id === "es" ? "At the café" : "Greetings Basics"),
      iconName: "book",
      iconBg: "bg-[#ECE9FF]",
      iconColor: "#6C4EF5",
      xpReward: l1?.xpReward || 20,
    });

    // Item 2: AI Conversation
    const l2 = unitLessons[1];
    items.push({
      id: l2?.id || "lesson-2",
      category: "AI Conversation",
      title: l2?.title || "Talk about your day",
      iconName: "headset",
      iconBg: "bg-[#E5F0FF]",
      iconColor: "#4D8BFF",
      xpReward: l2?.xpReward || 25,
    });

    // Item 3: New words
    const l3 = unitLessons[2];
    items.push({
      id: l3?.id || "lesson-3",
      category: "New words",
      title: l3?.title || "10 words",
      iconName: "happy-outline",
      iconBg: "bg-[#FFEAEA]",
      iconColor: "#FF4D4F",
      xpReward: l3?.xpReward || 15,
    });

    return items;
  }, [unitLessons, currentLanguage]);

  const handleLessonPress = (item: typeof planItems[0]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const isCompleted = completedLessonIds.includes(item.id);

    if (isCompleted) {
      Alert.alert(
        "Lesson Completed",
        `You have already completed this lesson and earned ${item.xpReward} XP!`
      );
    } else {
      Alert.alert(
        "Start Lesson",
        `Would you like to start "${item.title}"?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Complete (Demo)",
            onPress: () => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              completeLesson(item.id);
              addXp(item.xpReward);
              Alert.alert("Congratulations!", `You completed "${item.title}" and earned +${item.xpReward} XP!`);
            },
          },
        ]
      );
    }
  };

  const handleResetForTesting = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      "Reset Testing Data",
      "This will reset your XP, streak, completed lessons, and clear selected language. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            resetProgress();
            setSelectedLanguageId(null);
            router.replace("/language-select");
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ── Top Header ────────────────────────────────── */}
      <View className="flex-row items-center justify-between pt-4 pb-4 px-6 border-b border-[#F3F4F6] bg-white">
        <View className="flex-row items-center gap-3">
          {/* Circular Language Flag */}
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/language-select");
            }}
            className="w-11 h-11 rounded-full bg-[#F6F7FB] border border-[#E5E7EB] items-center justify-center active:opacity-80"
            style={styles.shadowSm}
          >
            <Text className="text-[24px]" style={{ lineHeight: 28 }}>
              {currentLanguage.flag}
            </Text>
          </Pressable>
          <Text className="text-[19px] font-poppins-bold text-text-primary">
            {greetingText}
          </Text>
        </View>

        <View className="flex-row items-center gap-4">
          {/* Flame/Streak */}
          <View className="flex-row items-center bg-[#FFF5EB] py-1.5 px-3 rounded-full border border-[#FFE0CC]">
            <Image
              source={images.streakFire}
              className="w-5 h-5 mr-1"
              resizeMode="contain"
            />
            <Text className="text-[15px] font-poppins-bold text-[#FF8A00]">
              {streak}
            </Text>
          </View>

          {/* Bell Icon */}
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Alert.alert("Notifications", "You have no new notifications.");
            }}
            className="w-10 h-10 rounded-full bg-white border border-[#E5E7EB] items-center justify-center active:opacity-75"
          >
            <Ionicons name="notifications-outline" size={20} color="#0D132B" />
          </Pressable>
        </View>
      </View>

      {/* ── Main Scroll View ──────────────────────────── */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-6">
          {/* ── Daily Goal Card ────────────────────────── */}
          <View className="bg-[#FFF9F2] rounded-3xl p-5 border border-[#FFE8CC] mb-6 flex-row items-center justify-between">
            <View className="flex-1 pr-4">
              <Text className="text-[12px] font-poppins-bold text-streak uppercase tracking-wider mb-1">
                Daily goal
              </Text>
              <View className="flex-row items-baseline gap-1">
                <Text className="text-[28px] font-poppins-bold text-text-primary">
                  {xp}
                </Text>
                <Text className="text-[16px] font-poppins text-text-secondary">
                  / 20 XP
                </Text>
              </View>
              {/* Custom Progress Bar */}
              <View className="w-full bg-[#FFEEDD] h-2.5 rounded-full mt-3 overflow-hidden">
                <View
                  className="bg-streak h-full rounded-full"
                  style={{ width: `${Math.min(100, (xp / 20) * 100)}%` }}
                />
              </View>
            </View>
            <Image
              source={images.treasure}
              className="w-16 h-16"
              resizeMode="contain"
            />
          </View>

          {/* ── Continue Learning Banner ────────────────── */}
          <View
            className="bg-lingua-purple rounded-3xl p-5 mb-8 flex-row items-center justify-between overflow-hidden"
            style={styles.gradientCard}
          >
            <View className="flex-1 pr-2 z-10">
              <Text className="text-[13px] font-poppins text-white/80 mb-0.5">
                Continue learning
              </Text>
              <Text className="text-[26px] font-poppins-bold text-white mb-1">
                {currentLanguage.name}
              </Text>
              <Text className="text-[14px] font-poppins text-white/90 mb-4.5">
                A1 • Unit {currentUnit.number}
              </Text>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  router.push("/(tabs)/learn");
                }}
                className="bg-white rounded-2xl py-2 px-5 self-start active:opacity-90"
                style={styles.shadowSm}
              >
                <Text className="text-[15px] font-poppins-bold text-lingua-purple">
                  Continue
                </Text>
              </Pressable>
            </View>
            <Image
              source={images.palace}
              className="w-24 h-24 absolute right-3 bottom-2 opacity-95"
              resizeMode="contain"
            />
          </View>

          {/* ── Today's Plan Section ───────────────────── */}
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-[20px] font-poppins-bold text-text-primary">
              Today{"'"}s plan
            </Text>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push("/(tabs)/learn");
              }}
              className="active:opacity-75"
            >
              <Text className="text-[15px] font-poppins-semibold text-lingua-purple">
                View all
              </Text>
            </Pressable>
          </View>

          {/* Activities List */}
          <View className="bg-white rounded-3xl border border-[#F3F4F6] px-5 py-2 mb-6" style={styles.shadowXl}>
            {planItems.map((item, index) => {
              const isCompleted = completedLessonIds.includes(item.id);
              return (
                <Pressable
                  key={item.id}
                  onPress={() => handleLessonPress(item)}
                  className="flex-row items-center justify-between py-4.5 border-b border-[#F3F4F6] last:border-b-0"
                >
                  <View className="flex-row items-center flex-1">
                    {/* Rounded Icon */}
                    <View
                      className={`w-12 h-12 rounded-2xl items-center justify-center mr-4 ${item.iconBg}`}
                    >
                      <Ionicons
                        name={item.iconName as any}
                        size={22}
                        color={item.iconColor}
                      />
                    </View>
                    {/* Text block */}
                    <View className="flex-1 pr-2">
                      <Text className="text-[16px] font-poppins-bold text-text-primary leading-5 mb-0.5">
                        {item.category}
                      </Text>
                      <Text className="text-[14px] font-poppins text-text-secondary leading-5">
                        {item.title}
                      </Text>
                    </View>
                  </View>

                  {/* Completion Status Indicator */}
                  <View className="ml-2">
                    {isCompleted ? (
                      <View className="w-6 h-6 rounded-full bg-lingua-purple items-center justify-center">
                        <Ionicons name="checkmark" size={13} color="white" />
                      </View>
                    ) : (
                      <View className="w-6 h-6 rounded-full border-2 border-[#E5E7EB] bg-white" />
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* ── Next Up Card ───────────────────────────── */}
          <View className="bg-[#F2FBF4] border border-[#E2F5E6] rounded-3xl p-5 mb-6 flex-row items-center justify-between">
            <View className="flex-1 pr-4">
              <Text className="text-[12px] font-poppins-bold text-[#21C16B] uppercase tracking-wider mb-1">
                Next up
              </Text>
              <Text className="text-[18px] font-poppins-bold text-text-primary mb-0.5">
                AI Video Call
              </Text>
              <Text className="text-[14px] font-poppins text-text-secondary">
                Practice speaking
              </Text>
            </View>

            <View className="flex-row items-center">
              {/* Teacher circular photo */}
              <Image
                source={{ uri: teacherAvatarUrl }}
                className="w-14 h-14 rounded-full border-2 border-white mr-3 bg-slate-200"
                resizeMode="cover"
              />

              {/* Call button */}
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  router.push("/(tabs)/ai-teacher");
                }}
                className="w-12 h-12 rounded-full bg-lingua-green items-center justify-center shadow-md shadow-[#21C16B]/25 active:opacity-90"
              >
                <Ionicons name="videocam" size={20} color="white" />
              </Pressable>
            </View>
          </View>

          {/* ── Test/Developer Settings Button ──────────── */}
          <Pressable
            onPress={handleResetForTesting}
            className="mt-4 mb-8 py-3.5 border border-dashed border-[#D1D5DB] rounded-2xl items-center justify-center active:bg-[#F9FAFB]"
          >
            <Text className="text-[14px] font-poppins-semibold text-text-secondary">
              🔧 Clear Cache & Reset State (Testing)
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  shadowSm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  shadowXl: {
    shadowColor: "#0D132B",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.04,
    shadowRadius: 20,
    elevation: 3,
  },
  gradientCard: {
    backgroundColor: "#6C4EF5",
    shadowColor: "#6C4EF5",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
});
