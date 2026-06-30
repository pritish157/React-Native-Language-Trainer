import React, { useState } from "react";
import { View, Text, Pressable, Image, StyleSheet, ImageBackground, Alert, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { useProgressStore } from "@/store/useProgressStore";
import { lessons } from "@/data/lessons";
import { images } from "@/constants/images";

// Conversation dataset matching activated languages
const conversationData: Record<string, { phrase: string; translation: string }[]> = {
  es: [
    { phrase: "¡Hola! Bienvenidos al Café Central. ¿Cómo te llamas?", translation: "Hello! Welcome to Central Cafe. What is your name?" },
    { phrase: "¡Muy bien! Un placer conocerte. ¿Qué te gustaría tomar hoy?", translation: "Very good! A pleasure to meet you. What would you like to drink today?" },
    { phrase: "Excelente elección. El café con leche aquí es delicioso.", translation: "Excellent choice. The coffee with milk here is delicious." },
    { phrase: "¡Perfecto! Todo está listo. Nos vemos pronto. ¡Adiós!", translation: "Perfect! Everything is ready. See you soon. Goodbye!" },
  ],
  fr: [
    { phrase: "Bonjour! Je m'appelle Chantal. Comment allez-vous today?", translation: "Hello! My name is Chantal. How are you today?" },
    { phrase: "Très bien! Oui, ça va bien, merci. Que désirez-vous commander?", translation: "Very good! Yes, I am doing well, thank you. What would you like to order?" },
    { phrase: "Ah, un croissant et un café, c'est délicieux!", translation: "Ah, a croissant and a coffee, that is delicious!" },
    { phrase: "Excellent! À bientôt, au revoir!", translation: "Excellent! See you soon, goodbye!" },
  ],
  ja: [
    { phrase: "はじめまして！さくらです。お名前は？", translation: "Nice to meet you! I am Sakura. What is your name?" },
    { phrase: "いいですね！とても素敵な名前です。", translation: "Nice! That is a very lovely name." },
    { phrase: "日本のコーヒーは美味しいですよ。飲みますか？", translation: "Japanese coffee is delicious, you know. Would you like to drink some?" },
    { phrase: "素晴らしい！また次のレッスンで会いましょう。さようなら！", translation: "Wonderful! Let's meet again in the next lesson. Goodbye!" },
  ],
  de: [
    { phrase: "Hallo! Ich bin dein Deutschlehrer. Wie heißt du?", translation: "Hello! I am your German teacher. What is your name?" },
    { phrase: "Sehr gut! Freut mich, dich kennenzulernen. Wie geht es dir?", translation: "Very good! Nice to meet you. How are you?" },
    { phrase: "Ich trinke gerne Kaffee am Morgen. Und du?", translation: "I like to drink coffee in the morning. And you?" },
    { phrase: "Hervorragend! Tschüss, bis zum nächsten Mal!", translation: "Excellent! Bye, see you next time!" },
  ],
  it: [
    { phrase: "Ciao! Benvenuto. Come ti chiami?", translation: "Hello! Welcome. What is your name?" },
    { phrase: "Molto bene! Piacere di conoscerti. Cosa vorresti ordinare?", translation: "Very good! Nice to meet you. What would you like to order?" },
    { phrase: "Ottimo! Un espresso e un gelato sono perfetti.", translation: "Great! An espresso and a gelato are perfect." },
    { phrase: "Fantastico! Ci vediamo alla prossima lezione. Ciao ciao!", translation: "Fantastic! See you next lesson. Bye bye!" },
  ],
};

export default function AudioLessonScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { completeLesson, streak } = useProgressStore();

  // Load lesson
  const lesson = lessons.find((l) => l.id === id) || lessons[0];
  const langId = lesson.unitId.split("-")[0] || "es";
  const phrases = conversationData[langId] || conversationData.es;

  // Toggle & interactive states
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [teacherSpeaking, setTeacherSpeaking] = useState(false);

  const currentPhrase = phrases[stepIndex] || phrases[0];

  // Play audio animation helper
  const handlePlayAudio = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTeacherSpeaking(true);
    setTimeout(() => {
      setTeacherSpeaking(false);
    }, 2000);
  };

  // Simulating dialogue step advancement on Mic tap
  const handleMicTap = () => {
    if (isMuted) {
      Alert.alert("Muted", "Please unmute your microphone to speak with the teacher.");
      return;
    }

    if (isListening) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsListening(true);

    // Simulate listening for 1.5 seconds, then the teacher responds
    setTimeout(() => {
      setIsListening(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      if (stepIndex < phrases.length - 1) {
        setStepIndex(stepIndex + 1);
        // Autoplay the teacher speaking the next phrase
        setTeacherSpeaking(true);
        setTimeout(() => setTeacherSpeaking(false), 2000);
      } else {
        // Lesson Complete!
        Alert.alert(
          "Lesson Completed! 🎉",
          `Congratulations! You finished the dialogue lesson "${lesson.title}" and earned +${lesson.xpReward} XP.`,
          [
            {
              text: "Finish",
              onPress: () => {
                completeLesson(lesson.id, lesson.xpReward);
                router.replace("/(tabs)/learn");
              },
            },
          ]
        );
      }
    }, 1800);
  };

  // Handle End Call confirm
  const handleEndCall = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      "End Lesson?",
      "Are you sure you want to exit the current lesson? Your progress for this session will be lost.",
      [
        {
          text: "Resume",
          style: "cancel",
        },
        {
          text: "Exit Lesson",
          style: "destructive",
          onPress: () => {
            router.replace("/(tabs)/learn");
          },
        },
      ]
    );
  };

  // Bottom tab bar navigation warning
  const handleTabPress = (routePath: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      "Exit Lesson?",
      "Navigating away will end your current audio session.",
      [
        { text: "Stay", style: "cancel" },
        {
          text: "Leave",
          style: "destructive",
          onPress: () => router.replace(routePath as any),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ── TOP BAR HEADER ─────────────────────────── */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-slate-100">
        <View className="flex-row items-center gap-3 flex-1">
          <Pressable onPress={handleEndCall} className="p-2 rounded-full active:bg-slate-100">
            <Ionicons name="chevron-back" size={24} color="#0D132B" />
          </Pressable>
          <View className="flex-row items-center gap-2">
            <Text className="text-[20px] font-poppins-bold text-text-primary">
              AI Teacher
            </Text>
            <View className="flex-row items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              <View className="w-2.5 h-2.5 rounded-full bg-[#21C16B]" />
              <Text className="text-[11px] font-poppins-medium text-[#21C16B]">
                Online
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row items-center gap-2">
          {/* Mock Camera Action Button */}
          <Pressable
            onPress={() => setIsCameraOn(!isCameraOn)}
            className={`p-2.5 rounded-full border items-center justify-center ${
              isCameraOn ? "bg-slate-50 border-slate-200 active:bg-slate-100" : "bg-slate-800 border-transparent"
            }`}
          >
            <Ionicons
              name={isCameraOn ? "videocam" : "videocam-off"}
              size={18}
              color={isCameraOn ? "#0D132B" : "#FFFFFF"}
            />
          </Pressable>

          {/* Streak Badge */}
          <View className="flex-row items-center justify-center min-w-[36px] h-9 px-2 bg-slate-50 border border-slate-200 rounded-full">
            <Text className="text-[13px] font-poppins-bold text-text-primary">
              {streak}
            </Text>
          </View>

          {/* Profile Circle */}
          <View className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 items-center justify-center overflow-hidden">
            <Ionicons name="person" size={16} color="#6B7280" />
          </View>
        </View>
      </View>

      {/* ── CALL CONTAINER AREA ─────────────────────── */}
      <View className="flex-1 px-6 pt-4 pb-2">
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80",
          }}
          blurRadius={10}
          style={styles.callCardBackground}
          imageStyle={styles.callCardImage}
        >
          {/* Top Overlay State Bar */}
          {isListening && (
            <View className="absolute top-4 left-4 right-4 bg-lingua-purple/90 border border-purple-400/30 px-4 py-2 rounded-2xl items-center flex-row gap-2 z-30 shadow-md">
              <Ionicons name="mic" size={16} color="#FFFFFF" className="animate-pulse" />
              <Text className="text-[13px] font-poppins-semibold text-white">
                Listening to you...
              </Text>
            </View>
          )}

          {/* User Self PIP Preview */}
          {isCameraOn && (
            <View
              className="absolute top-4 right-4 w-20 h-28 rounded-2xl border-2 border-white overflow-hidden z-20 shadow-md"
              style={styles.pipShadow}
            >
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
                }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          )}

          {/* Waving Mascot Teacher Illustration */}
          <View className="flex-1 justify-center items-center">
            <Image
              source={images.mascotTeacher}
              className={`w-52 h-52 mt-6 ${teacherSpeaking ? "scale-105" : ""}`}
              resizeMode="contain"
            />
          </View>

          {/* Conversational Speech Bubble */}
          <View className="bg-white rounded-3xl p-5 mb-3 flex-row items-center justify-between shadow-md relative border border-purple-50">
            <View className="flex-1 mr-4">
              <Text className="text-[17px] font-poppins-bold text-text-primary">
                {currentPhrase.phrase}
              </Text>
              {showSubtitles && (
                <Text className="text-[13px] font-poppins text-text-secondary mt-1">
                  {currentPhrase.translation}
                </Text>
              )}
            </View>

            {/* Audio Voice Player */}
            <Pressable
              onPress={handlePlayAudio}
              className={`w-10 h-10 rounded-full items-center justify-center ${
                teacherSpeaking ? "bg-[#EEF2FF]" : "bg-slate-50 active:bg-slate-100"
              }`}
            >
              <Ionicons
                name="volume-high"
                size={20}
                color={teacherSpeaking ? "#6C4EF5" : "#6B7280"}
              />
            </Pressable>

            {/* Bubble tail decoration */}
            <View style={styles.bubbleTail} />
          </View>
        </ImageBackground>
      </View>

      {/* ── CALL CONTROLS BUTTONS ROW ───────────────── */}
      <View className="bg-slate-900 mx-6 rounded-3xl p-4 flex-row justify-around items-center shadow-lg border border-slate-800">
        {/* Camera Toggle */}
        <View className="items-center">
          <Pressable
            onPress={() => setIsCameraOn(!isCameraOn)}
            className={`w-12 h-12 rounded-full items-center justify-center ${
              isCameraOn ? "bg-white" : "bg-slate-800"
            }`}
          >
            <Ionicons
              name={isCameraOn ? "videocam" : "videocam-off"}
              size={22}
              color={isCameraOn ? "#0D132B" : "#9CA3AF"}
            />
          </Pressable>
          <Text className="text-[11px] font-poppins-semibold text-white/80 mt-1.5">
            Camera
          </Text>
        </View>

        {/* Mic Toggle */}
        <View className="items-center">
          <Pressable
            onPress={() => setIsMuted(!isMuted)}
            className={`w-12 h-12 rounded-full items-center justify-center ${
              !isMuted ? "bg-white" : "bg-red-500"
            }`}
          >
            <Ionicons
              name={!isMuted ? "mic" : "mic-off"}
              size={22}
              color={!isMuted ? "#0D132B" : "#FFFFFF"}
            />
          </Pressable>
          <Text className="text-[11px] font-poppins-semibold text-white/80 mt-1.5">
            Mic
          </Text>
        </View>

        {/* Subtitles Toggle */}
        <View className="items-center">
          <Pressable
            onPress={() => setShowSubtitles(!showSubtitles)}
            className={`w-12 h-12 rounded-full items-center justify-center ${
              showSubtitles ? "bg-white" : "bg-slate-800"
            }`}
          >
            <Ionicons
              name="text-outline"
              size={22}
              color={showSubtitles ? "#0D132B" : "#9CA3AF"}
            />
          </Pressable>
          <Text className="text-[11px] font-poppins-semibold text-white/80 mt-1.5">
            Subtitles
          </Text>
        </View>

        {/* End Call Button */}
        <View className="items-center">
          <Pressable
            onPress={handleEndCall}
            className="w-12 h-12 rounded-full bg-[#FF4D4F] items-center justify-center active:bg-red-600"
          >
            <Ionicons name="call" style={{ transform: [{ rotate: "135deg" }] }} size={22} color="#FFFFFF" />
          </Pressable>
          <Text className="text-[11px] font-poppins-semibold text-white/80 mt-1.5">
            End Call
          </Text>
        </View>
      </View>

      {/* ── MOCK INTERACTION GUIDE ─────────────────── */}
      <View className="px-6 py-2 items-center">
        <Pressable
          onPress={handleMicTap}
          disabled={isListening}
          className={`flex-row items-center justify-center py-2.5 px-6 rounded-2xl w-full border ${
            isListening
              ? "bg-purple-50 border-purple-200"
              : isMuted
              ? "bg-slate-100 border-slate-200"
              : "bg-[#F3EFFF] border-purple-200 active:bg-purple-100"
          }`}
        >
          <Ionicons
            name="mic"
            size={18}
            color={isMuted ? "#9CA3AF" : "#6C4EF5"}
            className="mr-2"
          />
          <Text
            className={`text-[14px] font-poppins-bold ${
              isMuted ? "text-[#9CA3AF]" : "text-lingua-purple"
            }`}
          >
            {isListening ? "Listening..." : isMuted ? "Unmute Mic to Practice Speaking" : "Tap to Speak (Practice Response)"}
          </Text>
        </Pressable>
      </View>

      {/* ── MOCK FEEDBACK COLUMNS CARD ──────────────── */}
      <View className="bg-white border border-slate-100 rounded-3xl mx-6 p-4 mb-2 flex-row justify-between items-center shadow-sm">
        <View className="flex-1 items-center">
          <Text className="text-[11px] font-poppins text-text-secondary">
            Speaking
          </Text>
          <Text className="text-[15px] font-poppins-bold text-[#21C16B] mt-0.5">
            Excellent
          </Text>
        </View>
        <View className="w-[1px] h-8 bg-slate-100" />
        <View className="flex-1 items-center">
          <Text className="text-[11px] font-poppins text-text-secondary">
            Pronunciation
          </Text>
          <Text className="text-[15px] font-poppins-bold text-[#4D8BFF] mt-0.5">
            Great
          </Text>
        </View>
        <View className="w-[1px] h-8 bg-slate-100" />
        <View className="flex-1 items-center">
          <Text className="text-[11px] font-poppins text-text-secondary">
            Grammar
          </Text>
          <Text className="text-[15px] font-poppins-bold text-lingua-purple mt-0.5">
            Good
          </Text>
        </View>
      </View>

      {/* ── BOTTOM TAB BAR REPLICA ─────────────────── */}
      <View style={styles.tabBarContainer}>
        {/* Sliding Circle Indicator mock under Learn */}
        <View style={styles.indicatorMock} />

        <View className="flex-row h-full">
          <Pressable onPress={() => handleTabPress("/(tabs)/home")} style={styles.tabItemMock}>
            <Ionicons name="home-outline" size={24} color="#8B8FA3" />
            <Text className="text-[10px] font-poppins-medium text-[#8B8FA3] mt-1">
              Home
            </Text>
          </Pressable>

          <Pressable onPress={() => handleTabPress("/(tabs)/learn")} style={styles.tabItemMock}>
            <Ionicons name="book" size={24} color="#FFFFFF" />
            <Text className="text-[10px] font-poppins-medium text-[#8B8FA3] mt-1 opacity-0">
              Learn
            </Text>
          </Pressable>

          <Pressable onPress={() => handleTabPress("/(tabs)/ai-teacher")} style={styles.tabItemMock}>
            <Ionicons name="videocam-outline" size={24} color="#8B8FA3" />
            <Text className="text-[10px] font-poppins-medium text-[#8B8FA3] mt-1">
              AI Teacher
            </Text>
          </Pressable>

          <Pressable onPress={() => handleTabPress("/(tabs)/chat")} style={styles.tabItemMock}>
            <Ionicons name="chatbubble-ellipses-outline" size={24} color="#8B8FA3" />
            <Text className="text-[10px] font-poppins-medium text-[#8B8FA3] mt-1">
              Chat
            </Text>
          </Pressable>

          <Pressable onPress={() => handleTabPress("/(tabs)/profile")} style={styles.tabItemMock}>
            <Ionicons name="person-outline" size={24} color="#8B8FA3" />
            <Text className="text-[10px] font-poppins-medium text-[#8B8FA3] mt-1">
              Profile
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  callCardBackground: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 16,
    position: "relative",
    overflow: "hidden",
  },
  callCardImage: {
    borderRadius: 24,
  },
  pipShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  bubbleTail: {
    width: 16,
    height: 16,
    backgroundColor: "#FFFFFF",
    transform: [{ rotate: "45deg" }],
    position: "absolute",
    bottom: -8,
    left: "50%",
    marginLeft: -8,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#F3EFFF",
  },
  tabBarContainer: {
    height: 66,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    position: "relative",
  },
  indicatorMock: {
    position: "absolute",
    top: (66 - 48) / 2,
    // 5 tabs, indicator centered on tab index 1 (Learn)
    left: "20%",
    marginLeft: (Dimensions.get("window").width / 5 - 48) / 2, // dynamic offset
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#6C4EF5",
    zIndex: 0,
  },
  tabItemMock: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
});
