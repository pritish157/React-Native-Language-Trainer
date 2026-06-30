import React, { useEffect } from "react";
import { View, Text, Pressable, Image, StyleSheet, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useUser, useAuth } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useLanguageStore } from "@/store/useLanguageStore";
import { useProgressStore } from "@/store/useProgressStore";
import { languages } from "@/data/languages";
import { images } from "@/constants/images";

interface PlanItem {
  id: string;
  type: "video" | "audio" | "chat" | "vocabulary";
  title: string;
  subtitle: string;
  iconName: "book-outline" | "headset-outline" | "chatbubble-ellipses-outline";
  iconBgColor: string;
  iconColor: string;
  xpReward: number;
}

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useAuth();
  
  const { selectedLanguageId, setSelectedLanguageId } = useLanguageStore();
  const { 
    xp, 
    dailyGoal, 
    streak, 
    completedLessons, 
    toggleLessonCompletion, 
    resetProgress, 
    addXp 
  } = useProgressStore();

  const currentLang = languages.find((l) => l.id === selectedLanguageId);
  const userFirstName = user?.firstName || "Alex";

  // Redirect if no language selected
  useEffect(() => {
    if (!selectedLanguageId) {
      router.replace("/language-select");
    }
  }, [selectedLanguageId, router]);

  const getGreeting = (langId: string | null) => {
    switch (langId) {
      case "es":
        return "Hola";
      case "fr":
        return "Bonjour";
      case "ja":
        return "こんにちは";
      default:
        return "Hello";
    }
  };

  const getPlanItems = (langId: string | null): PlanItem[] => {
    switch (langId) {
      case "es":
        return [
          {
            id: "es-lesson-1-3",
            type: "video",
            title: "Lesson",
            subtitle: "At the café",
            iconName: "book-outline",
            iconBgColor: "bg-[#ECE9FF]",
            iconColor: "#6C4EF5",
            xpReward: 25,
          },
          {
            id: "es-lesson-1-2",
            type: "chat",
            title: "AI Conversation",
            subtitle: "Talk about your day",
            iconName: "headset-outline",
            iconBgColor: "bg-[#ECE9FF]",
            iconColor: "#6C4EF5",
            xpReward: 20,
          },
          {
            id: "es-lesson-1-1",
            type: "vocabulary",
            title: "New words",
            subtitle: "10 words",
            iconName: "chatbubble-ellipses-outline",
            iconBgColor: "bg-[#FFE4E6]",
            iconColor: "#FF4D4F",
            xpReward: 15,
          },
        ];
      case "fr":
        return [
          {
            id: "fr-lesson-1-1",
            type: "vocabulary",
            title: "Lesson",
            subtitle: "French Basics",
            iconName: "book-outline",
            iconBgColor: "bg-[#ECE9FF]",
            iconColor: "#6C4EF5",
            xpReward: 15,
          },
          {
            id: "fr-lesson-1-2",
            type: "audio",
            title: "AI Conversation",
            subtitle: "Greetings audio practice",
            iconName: "headset-outline",
            iconBgColor: "bg-[#ECE9FF]",
            iconColor: "#6C4EF5",
            xpReward: 15,
          },
          {
            id: "fr-lesson-mock-1",
            type: "vocabulary",
            title: "New words",
            subtitle: "6 words",
            iconName: "chatbubble-ellipses-outline",
            iconBgColor: "bg-[#FFE4E6]",
            iconColor: "#FF4D4F",
            xpReward: 10,
          },
        ];
      case "ja":
        return [
          {
            id: "ja-lesson-1-1",
            type: "vocabulary",
            title: "Lesson",
            subtitle: "Hiragana & Greetings",
            iconName: "book-outline",
            iconBgColor: "bg-[#ECE9FF]",
            iconColor: "#6C4EF5",
            xpReward: 15,
          },
          {
            id: "ja-lesson-1-2",
            type: "chat",
            title: "AI Conversation",
            subtitle: "Self Introduction",
            iconName: "headset-outline",
            iconBgColor: "bg-[#ECE9FF]",
            iconColor: "#6C4EF5",
            xpReward: 20,
          },
          {
            id: "ja-lesson-mock-1",
            type: "vocabulary",
            title: "New words",
            subtitle: "8 words",
            iconName: "chatbubble-ellipses-outline",
            iconBgColor: "bg-[#FFE4E6]",
            iconColor: "#FF4D4F",
            xpReward: 10,
          },
        ];
      default:
        return [
          {
            id: "default-1",
            type: "vocabulary",
            title: "Lesson",
            subtitle: "Getting Started",
            iconName: "book-outline",
            iconBgColor: "bg-[#ECE9FF]",
            iconColor: "#6C4EF5",
            xpReward: 10,
          },
          {
            id: "default-2",
            type: "chat",
            title: "AI Conversation",
            subtitle: "First conversation",
            iconName: "headset-outline",
            iconBgColor: "bg-[#ECE9FF]",
            iconColor: "#6C4EF5",
            xpReward: 10,
          },
          {
            id: "default-3",
            type: "vocabulary",
            title: "New words",
            subtitle: "Basic vocabulary",
            iconName: "chatbubble-ellipses-outline",
            iconBgColor: "bg-[#FFE4E6]",
            iconColor: "#FF4D4F",
            xpReward: 10,
          },
        ];
    }
  };

  const getTeacherAvatar = (langId: string | null) => {
    switch (langId) {
      case "es":
        return "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"; // Sofia
      case "fr":
        return "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"; // Chantal
      case "ja":
        return "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&auto=format&fit=crop&q=80"; // Sakura
      default:
        return "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80";
    }
  };

  const getLanguageIllustration = (langId: string | null) => {
    switch (langId) {
      case "es":
        return images.palace;
      case "fr":
        return { uri: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&auto=format&fit=crop&q=80" };
      case "ja":
        return { uri: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&auto=format&fit=crop&q=80" };
      default:
        return images.earth;
    }
  };

  const handleClearState = async () => {
    try {
      await AsyncStorage.removeItem("language-storage");
      await AsyncStorage.removeItem("progress-storage");
      setSelectedLanguageId(null);
      resetProgress();
      Alert.alert("Success", "AsyncStorage cleared! Redirecting...");
      router.replace("/");
    } catch {
      Alert.alert("Error", "Failed to clear state.");
    }
  };

  const greeting = getGreeting(selectedLanguageId);
  const planItems = getPlanItems(selectedLanguageId);
  const progressRatio = Math.min(1, xp / dailyGoal);

  // Determine correct unit number presentation
  const unitText = currentLang?.id === "es" ? "A1 • Unit 3" : "A1 • Unit 1";

  if (!selectedLanguageId) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ── HEADER SECTION ─────────────────────────── */}
      <View className="flex-row items-center justify-between px-4 py-4 bg-white border-b border-slate-100">
        <View className="flex-row items-center gap-2.5 flex-1 mr-3">
          {/* Flag Circular Badge */}
          <View className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center border border-slate-200 overflow-hidden shadow-sm flex-shrink-0">
            <Text className="text-[26px]">{currentLang?.flagEmoji || "🌐"}</Text>
          </View>
          {/* Greeting text */}
          <Text className="text-[18px] font-poppins-bold text-text-primary flex-shrink" numberOfLines={1}>
            {greeting}, {userFirstName}! 👋
          </Text>
        </View>

        <View className="flex-row items-center gap-3 flex-shrink-0">
          {/* Streak Indicator Badge */}
          <View className="flex-row items-center gap-1.5 bg-[#FFF5EB] px-3 py-1.5 rounded-full border border-[#FFE8CC]">
            <Image
              source={images.streakFire}
              className="w-5 h-5"
              resizeMode="contain"
            />
            <Text className="text-[13px] font-poppins-bold text-streak">
              {streak}
            </Text>
          </View>

          {/* Notification Bell */}
          <Pressable 
            onPress={() => Alert.alert("Notifications", "You have no new notifications.")}
            className="p-1 rounded-full active:bg-slate-100"
          >
            <Ionicons name="notifications-outline" size={24} color="#0D132B" />
          </Pressable>
        </View>
      </View>

      {/* ── SCROLLABLE BODY CONTENT ────────────────── */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── DAILY GOAL CARD ────────────────────────── */}
        <Pressable 
          onPress={() => {
            addXp(5);
            Alert.alert("XP Added!", "You gained +5 XP for practicing! Try completing a plan item below.");
          }}
          className="bg-[#FFFDF9] border border-[#FFE8CC] rounded-[24px] p-5 mb-5 flex-row items-center justify-between shadow-sm active:opacity-95"
        >
          <View className="flex-1 mr-4">
            <Text className="text-[14px] font-poppins-medium text-text-secondary">
              Daily goal
            </Text>
            <View className="flex-row items-baseline mt-1">
              <Text className="text-[28px] font-poppins-bold text-text-primary">
                {xp}
              </Text>
              <Text className="text-[15px] font-poppins text-text-secondary ml-1">
                / {dailyGoal} XP
              </Text>
            </View>

            {/* Progress Bar */}
            <View className="w-full h-3 bg-orange-100/50 rounded-full mt-3 overflow-hidden border border-[#FFE8CC]/50">
              <View 
                className="h-full bg-streak rounded-full" 
                style={{ width: `${progressRatio * 100}%` }}
              />
            </View>
          </View>

          {/* Treasure Chest */}
          <Image
            source={images.treasure}
            className="w-[84px] h-[84px]"
            resizeMode="contain"
          />
        </Pressable>

        {/* ── CONTINUE LEARNING BANNER ───────────────── */}
        <View className="bg-[#6C4EF5] rounded-[24px] p-6 mb-6 flex-row items-center justify-between relative overflow-hidden shadow-md">
          {/* Layout Content */}
          <View className="flex-1 z-10 pr-28">
            <Text className="text-[13px] font-poppins text-white/80">
              Continue learning
            </Text>
            <Text className="text-[26px] font-poppins-bold text-white mt-0.5">
              {currentLang?.name || "Spanish"}
            </Text>
            <Text className="text-[14px] font-poppins-medium text-white/90 mt-1">
              {unitText}
            </Text>

            <Pressable
              onPress={() => router.push("/(tabs)/learn")}
              className="bg-white rounded-2xl px-5 py-2.5 mt-4 self-start active:bg-slate-50 shadow-sm"
              style={({ pressed }) => ({
                opacity: pressed ? 0.95 : 1,
              })}
            >
              <Text className="text-[14px] font-poppins-semibold text-lingua-purple">
                Continue
              </Text>
            </Pressable>
          </View>

          {/* Right absolute illustration */}
          <Image
            source={getLanguageIllustration(selectedLanguageId)}
            className="w-[125px] h-[125px] absolute right-0 bottom-0"
            resizeMode="contain"
          />
        </View>

        {/* ── TODAY'S PLAN SECTION ───────────────────── */}
        <View className="mb-2">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-[20px] font-poppins-bold text-text-primary">
              {"Today's plan"}
            </Text>
            <Pressable onPress={() => Alert.alert("Coming Soon", "The full curriculum view will be available in future releases.")}>
              <Text className="text-[14px] font-poppins-semibold text-lingua-purple">
                View all
              </Text>
            </Pressable>
          </View>

          {/* Plan items list */}
          <View className="gap-4">
            {planItems.map((item) => {
              const isCompleted = completedLessons.includes(item.id);

              return (
                <Pressable
                  key={item.id}
                  onPress={() => toggleLessonCompletion(item.id, item.xpReward)}
                  className="flex-row items-center justify-between bg-white border border-slate-100 rounded-2xl p-4 active:bg-slate-50/80 shadow-sm"
                >
                  <View className="flex-row items-center gap-4 flex-1">
                    {/* Icon container */}
                    <View className={`w-12 h-12 rounded-2xl ${item.iconBgColor} items-center justify-center`}>
                      <Ionicons name={item.iconName} size={22} color={item.iconColor} />
                    </View>

                    {/* Text block */}
                    <View className="flex-1">
                      <Text className="text-[16px] font-poppins-semibold text-text-primary">
                        {item.title}
                      </Text>
                      <Text className="text-[13px] font-poppins text-text-secondary mt-0.5">
                        {item.subtitle}
                      </Text>
                    </View>
                  </View>

                  {/* Circular checkbox indicator */}
                  {isCompleted ? (
                    <View className="w-6 h-6 rounded-full bg-lingua-purple items-center justify-center shadow-sm">
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                    </View>
                  ) : (
                    <View className="w-6 h-6 rounded-full border-2 border-slate-200 bg-white" />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* ── NEXT UP SECTION ────────────────────────── */}
        <View className="bg-[#F2F8F4] border border-[#E2EFE7] rounded-[24px] p-5 mt-6 mb-4 flex-row items-center justify-between shadow-sm">
          <View className="flex-1 mr-4">
            <Text className="text-[12px] font-poppins-bold text-[#66A07E] uppercase tracking-wider">
              Next up
            </Text>
            <Text className="text-[20px] font-poppins-bold text-text-primary mt-1">
              AI Video Call
            </Text>
            <Text className="text-[14px] font-poppins-medium text-[#66A07E] mt-0.5">
              Practice speaking
            </Text>
          </View>

          {/* Right avatar and camera action */}
          <View className="relative">
            <Image
              source={{ uri: getTeacherAvatar(selectedLanguageId) }}
              className="w-[72px] h-[72px] rounded-full border-2 border-white"
            />
            {/* Action camera icon badge */}
            <Pressable 
              onPress={() => Alert.alert("Coming Soon", "Video Call lesson functionality will be implemented in the next module.")}
              className="w-9 h-9 rounded-full bg-success items-center justify-center absolute -bottom-1 -right-2 border-2 border-white shadow-sm active:opacity-90"
            >
              <Ionicons name="videocam" size={16} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>

        {/* ── TESTING TRIGGERS (BOTTOM) ──────────────── */}
        <View className="mt-8 border-t border-slate-100 pt-6 gap-4">
          <Text className="text-center text-[12px] font-poppins text-text-secondary">
            Developer Testing Options
          </Text>

          <View className="flex-row gap-3">
            <Pressable
              onPress={() => router.push("/language-select")}
              className="flex-1 border border-border bg-white rounded-xl py-3.5 items-center justify-center active:bg-slate-50"
            >
              <Text className="text-[14px] font-poppins-semibold text-text-primary">
                Switch Language
              </Text>
            </Pressable>

            <Pressable
              onPress={handleClearState}
              className="flex-1 border border-error bg-white rounded-xl py-3.5 items-center justify-center active:bg-red-50"
            >
              <Text className="text-[14px] font-poppins-semibold text-error">
                Reset All State
              </Text>
            </Pressable>
          </View>

          <Pressable
            onPress={() => signOut()}
            className="border border-slate-300 bg-slate-50 rounded-xl py-3.5 items-center justify-center active:bg-slate-100"
          >
            <Text className="text-[14px] font-poppins-semibold text-text-secondary">
              Sign Out
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
});
