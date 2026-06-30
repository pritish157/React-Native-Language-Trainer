import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  ImageBackground,
  Alert,
  Modal,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  cancelAnimation,
} from "react-native-reanimated";

import { useProgressStore } from "@/store/useProgressStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { lessons } from "@/data/lessons";
import { languages } from "@/data/languages";
import { images } from "@/constants/images";
import { useUser } from "@clerk/expo";

export default function AiTeacherScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const lessonId = params.lessonId;

  const { selectedLanguageId } = useLanguageStore();
  const { completedLessonIds, streak, completeLesson, addXp } = useProgressStore();
  const { user } = useUser();

  // Load selected or next incomplete lesson
  const lesson = useMemo(() => {
    if (lessonId && typeof lessonId === "string") {
      return lessons.find((l) => l.id === lessonId) || null;
    }
    
    const langId = selectedLanguageId || "es";
    const languageLessons = lessons.filter((l) => l.id.startsWith(langId));
    
    const incomplete = languageLessons.find((l) => !completedLessonIds.includes(l.id));
    if (incomplete) return incomplete;
    
    return languageLessons[0] || lessons[0];
  }, [lessonId, selectedLanguageId, completedLessonIds]);

  // Determine target language details
  const language = useMemo(() => {
    if (!lesson) return null;
    const langId = lesson.id.split("-")[0];
    return languages.find((lang) => lang.id === langId) || languages[0];
  }, [lesson]);

  // Dynamically extract phrases and vocabulary items from lesson activities
  const lessonPhrases = useMemo(() => {
    if (!lesson) return [];
    const items: { phrase: string; meaning: string }[] = [];
    
    lesson.activities.forEach((act) => {
      if (act.phrases) {
        act.phrases.forEach((p) => {
          items.push({ phrase: p.phrase, meaning: p.meaning });
        });
      }
      if (act.vocabularyItems) {
        act.vocabularyItems.forEach((v) => {
          items.push({ phrase: v.word, meaning: v.meaning });
        });
      }
    });

    // Fallbacks if no phrases are defined in activities
    if (items.length === 0) {
      const langId = lesson.id.split("-")[0];
      if (langId === "es") {
        items.push({ phrase: "Hola, ¿cómo estás?", meaning: "Hello, how are you?" });
        items.push({ phrase: "Buenos días", meaning: "Good morning" });
        items.push({ phrase: "Adiós", meaning: "Goodbye" });
      } else if (langId === "fr") {
        items.push({ phrase: "Bonjour, comment ça va ?", meaning: "Hello, how is it going?" });
        items.push({ phrase: "Salut !", meaning: "Hi!" });
        items.push({ phrase: "Merci beaucoup", meaning: "Thank you very much" });
      } else {
        items.push({ phrase: "Hello!", meaning: "Hello!" });
      }
    }
    return items;
  }, [lesson]);

  // Determine teacher name based on language
  const teacherName = useMemo(() => {
    if (!lesson) return "Alex";
    const langId = lesson.id.split("-")[0];
    if (langId === "es") return "Sofia";
    if (langId === "fr") return "Chloé";
    if (langId === "ja") return "Sakura";
    if (langId === "de") return "Hans";
    if (langId === "ko") return "Min-ji";
    if (langId === "it") return "Giulia";
    return "Alex";
  }, [lesson]);

  // Screen interactive state
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);

  // Simulated AI dialog stages
  const [stepIndex, setStepIndex] = useState(-1); // -1 is the greeting stage
  const [sessionStatus, setSessionStatus] = useState("Connecting...");
  const [bubbleText, setBubbleText] = useState("");
  const [bubbleTranslation, setBubbleTranslation] = useState("");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Performance feedback scores (simulated)
  const [speakingScore, setSpeakingScore] = useState("Excellent");
  const [pronunciationScore, setPronunciationScore] = useState("Great");
  const [grammarScore, setGrammarScore] = useState("Good");

  // Reanimated values for animations
  const bubbleScale = useSharedValue(0);
  const bubbleTranslateY = useSharedValue(20);
  const soundwaveScale = useSharedValue(1);
  const pulseScale = useSharedValue(1);
  const mascotScale = useSharedValue(1);

  // Speech bubble animation trigger
  useEffect(() => {
    if (bubbleText !== "") {
      bubbleScale.value = withSpring(1, { damping: 12 });
      bubbleTranslateY.value = withSpring(0, { damping: 12 });
    } else {
      bubbleScale.value = withTiming(0, { duration: 150 });
      bubbleTranslateY.value = withTiming(20, { duration: 150 });
    }
  }, [bubbleText, bubbleScale, bubbleTranslateY]);

  // Pulsating animation for speaker icon when active
  useEffect(() => {
    if (isPlayingAudio) {
      soundwaveScale.value = withRepeat(
        withSequence(
          withTiming(1.25, { duration: 250 }),
          withTiming(1.0, { duration: 250 })
        ),
        -1,
        true
      );
      // Gentle mascot animation while speaking
      mascotScale.value = withRepeat(
        withSequence(
          withTiming(1.03, { duration: 350 }),
          withTiming(1.0, { duration: 350 })
        ),
        -1,
        true
      );
    } else {
      cancelAnimation(soundwaveScale);
      cancelAnimation(mascotScale);
      soundwaveScale.value = 1;
      mascotScale.value = 1;
    }
  }, [isPlayingAudio, mascotScale, soundwaveScale]);

  // Mic pulsating animation when active/recording
  useEffect(() => {
    if (isListening) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 550 }),
          withTiming(1.0, { duration: 550 })
        ),
        -1,
        true
      );
    } else {
      cancelAnimation(pulseScale);
      pulseScale.value = 1;
    }
  }, [isListening, pulseScale]);

  // Dynamic teacher greeting sequence on mount
  const startGreetingSequence = useCallback(() => {
    if (!lesson) return;
    setSessionStatus(`${teacherName} is speaking...`);
    setIsPlayingAudio(true);

    const langId = lesson.id.split("-")[0];
    let greeting = `Hello! Welcome to your lesson. I am ${teacherName}. Let's learn!`;
    let translation = `Hello! Welcome to your lesson. I am ${teacherName}. Let's learn!`;

    if (langId === "es") {
      greeting = `¡Hola! Bienvenido a tu lección de español. Soy ${teacherName}. ¡Comencemos!`;
      translation = `Hello! Welcome to your Spanish lesson. I am ${teacherName}. Let's start!`;
    } else if (langId === "fr") {
      greeting = `Bonjour ! Bienvenue à votre leçon de français. Je suis ${teacherName}. Commençons !`;
      translation = `Hello! Welcome to your French lesson. I am ${teacherName}. Let's start!`;
    } else if (langId === "ja") {
      greeting = `こんにちは！日本語のレッスンへようこそ。私は${teacherName}です。始めましょう！`;
      translation = `Hello! Welcome to your Japanese lesson. I am ${teacherName}. Let's start!`;
    } else if (langId === "de") {
      greeting = `Hallo! Willkommen zu deiner Deutschstunde. Ich bin ${teacherName}. Fangen wir an!`;
      translation = `Hello! Welcome to your German lesson. I am ${teacherName}. Let's start!`;
    } else if (langId === "ko") {
      greeting = `안녕하세요! 한국어 레슨에 오신 것을 환영합니다. 저는 ${teacherName}입니다. 시작해요!`;
      translation = `Hello! Welcome to your Korean lesson. I am ${teacherName}. Let's start!`;
    } else if (langId === "it") {
      greeting = `Ciao! Benvenuto alla tua lezione di italiano. Sono ${teacherName}. Cominciamo!`;
      translation = `Hello! Welcome to your Italian lesson. I am ${teacherName}. Let's start!`;
    }

    setBubbleText(greeting);
    setBubbleTranslation(translation);

    setTimeout(() => {
      setIsPlayingAudio(false);
      setSessionStatus("Online");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 2800);
  }, [lesson, teacherName]);

  // Initialize call
  useEffect(() => {
    setSessionStatus("Connecting...");
    const timer = setTimeout(() => {
      startGreetingSequence();
    }, 1000);
    return () => clearTimeout(timer);
  }, [startGreetingSequence]);

  // Audio speaker press inside bubble
  const handleSpeakerPress = () => {
    if (isPlayingAudio || isListening) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsPlayingAudio(true);
    setSessionStatus(`${teacherName} is speaking...`);

    setTimeout(() => {
      setIsPlayingAudio(false);
      setSessionStatus("Online");
    }, 2000);
  };

  // Mic press handles interactive dialogue cycle
  const handleMicPress = () => {
    if (!lesson) return;
    if (isListening || isPlayingAudio) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsListening(true);
    setSessionStatus("Recording your voice...");

    // Simulate listening for 2 seconds
    setTimeout(() => {
      setSessionStatus("Analyzing pronunciation...");
      
      // Simulate analysis for 1.5 seconds
      setTimeout(() => {
        setIsListening(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Update scores randomly
        const scores = ["Excellent", "Great", "Good"];
        setSpeakingScore("Excellent");
        setPronunciationScore(scores[Math.floor(Math.random() * 2)]);
        setGrammarScore(scores[Math.floor(Math.random() * 3)]);

        // Advance step
        const nextIdx = stepIndex + 1;
        if (nextIdx < lessonPhrases.length) {
          setStepIndex(nextIdx);
          const item = lessonPhrases[nextIdx];
          setBubbleText(item.phrase);
          setBubbleTranslation(item.meaning);
          setSessionStatus("Online");

          // Play the teacher's new phrase audio automatically
          setIsPlayingAudio(true);
          setSessionStatus(`${teacherName} is speaking...`);
          setTimeout(() => {
            setIsPlayingAudio(false);
            setSessionStatus("Online");
          }, 2200);
        } else {
          // Completed all phrases
          setSessionStatus("Online");
          Alert.alert(
            "Lesson Completed! 🎉",
            `Congratulations! You finished the audio dialogue "${lesson.title}" and earned +${lesson.xpReward} XP.`,
            [
              {
                text: "Finish",
                onPress: () => {
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  completeLesson(lesson.id);
                  addXp(lesson.xpReward);
                  router.replace("/(tabs)/learn");
                },
              },
            ]
          );
        }
      }, 1500);
    }, 2000);
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
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            router.replace("/(tabs)/learn");
          },
        },
      ]
    );
  };

  // Back chevron press
  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      "Exit Lesson?",
      "Are you sure you want to leave? Your current audio session will end.",
      [
        { text: "Stay", style: "cancel" },
        {
          text: "Leave",
          style: "destructive",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            router.replace("/(tabs)/learn");
          },
        },
      ]
    );
  };

  // Reanimated style bindings
  const animatedBubbleStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: bubbleScale.value },
        { translateY: bubbleTranslateY.value },
      ],
    };
  });

  const animatedSpeakerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: soundwaveScale.value }],
    };
  });

  const animatedMicStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseScale.value }],
    };
  });

  const animatedMascotStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: mascotScale.value }],
    };
  });

  if (!lesson) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-[18px] font-poppins-bold text-error mb-2">Lesson Not Found</Text>
          <Pressable onPress={() => router.replace("/(tabs)/learn")} className="bg-lingua-purple px-6 py-3 rounded-xl mt-4">
            <Text className="text-white font-poppins-bold">Go to Lessons</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-white justify-between">
      {/* ── TOP HEADER ─────────────────────────── */}
      <SafeAreaView edges={["top"]} style={{ backgroundColor: "#FFFFFF" }}>
        <View className="flex-row items-center justify-between px-5 pt-3 pb-3 border-b border-[#F3F4F6] bg-white">
          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={handleBack}
              className="w-8 h-8 items-center justify-center active:opacity-75"
            >
              <Ionicons name="chevron-back" size={26} color="#0D132B" style={{ marginLeft: -6 }} />
            </Pressable>
            <View>
              <Text className="text-[20px] font-poppins-bold text-[#0D132B] leading-6">
                AI Teacher
              </Text>
              <View className="flex-row items-center gap-1.5 mt-0.5">
                <View className="w-2 h-2 rounded-full bg-[#21C16B]" />
                <Text className="text-[12px] font-poppins text-text-secondary">
                  {sessionStatus === "Connecting..." ? "Connecting..." : "Online"}
                </Text>
              </View>
            </View>
          </View>

          <View className="flex-row items-center gap-2">
            {/* Toggle Camera Action */}
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setIsCameraOn(!isCameraOn);
              }}
              className="w-10 h-10 items-center justify-center rounded-full border border-[#E5E7EB] bg-white active:bg-[#F3F4F6]"
            >
              <Ionicons
                name="videocam-outline"
                size={20}
                color="#0D132B"
              />
            </Pressable>

            {/* Streak Badge */}
            <View className="w-10 h-10 rounded-full border border-[#E5E7EB] bg-white items-center justify-center">
              <Text className="text-[15px] font-poppins-bold text-[#0D132B]">
                {streak}
              </Text>
            </View>

            {/* Silhouette Details Trigger */}
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setIsDetailsVisible(true);
              }}
              className="w-10 h-10 items-center justify-center rounded-full border border-[#E5E7EB] bg-white active:bg-[#F3F4F6]"
            >
              <Ionicons name="person-outline" size={20} color="#0D132B" />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>

      {/* ── MAIN WORKSPACE CARD ──────────────────────── */}
      <View className="flex-1 relative mx-5 mt-3 mb-3 rounded-[32px] overflow-hidden border border-[#E5E7EB] bg-[#F3F4F6]">
        <ImageBackground
          source={images.roomBackground}
          className="absolute inset-0 w-full h-full justify-between"
          resizeMode="cover"
        >
          {/* Floating Status Badge inside workspace */}
          <View className="absolute top-4 left-4 bg-black/40 rounded-full px-3 py-1.5 flex-row items-center gap-1.5">
            {isListening || isPlayingAudio ? (
              <View className="flex-row gap-0.5 items-center">
                <View className="w-1 h-2.5 bg-white rounded-full animate-pulse" />
                <View className="w-1 h-3.5 bg-white rounded-full" />
                <View className="w-1 h-2 bg-white rounded-full animate-pulse" />
              </View>
            ) : (
              <View className="w-1.5 h-1.5 rounded-full bg-[#21C16B]" />
            )}
            <Text className="text-[10px] font-poppins-bold text-white uppercase tracking-wider">
              {sessionStatus}
            </Text>
          </View>

          {/* Student PIP Window (upper right) */}
          {isCameraOn && (
            <View 
              style={styles.pipShadow}
              className="absolute top-4 right-4 w-20 h-28 rounded-2xl border-2 border-white overflow-hidden bg-gray-200"
            >
              <Image
                source={user?.imageUrl ? { uri: user.imageUrl } : images.studentPreview}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          )}

          {/* Waving Mascot Fox Teacher */}
          <View className="flex-1 justify-center items-center mt-6">
            <Animated.View style={animatedMascotStyle}>
              <Image
                source={images.mascotFoxTeacher}
                className="w-48 h-48 mt-4"
                resizeMode="contain"
              />
            </Animated.View>
          </View>

          {/* Compact Speech Bubble (Subtitles must not cover background image completely) */}
          {bubbleText !== "" && (
            <Animated.View
              style={[animatedBubbleStyle]}
              className="absolute bottom-[94px] left-4 right-4 bg-white rounded-[24px] p-4 shadow-lg border border-[#F3F4F6] z-30"
            >
              <View className="flex-row items-center justify-between gap-3">
                <View className="flex-1">
                  <Text className="text-[16px] font-poppins-bold text-[#0D132B] leading-5">
                    {bubbleText}
                  </Text>
                  {showSubtitles && (
                    <Text className="text-[13px] font-poppins text-text-secondary mt-1 leading-4">
                      {bubbleTranslation}
                    </Text>
                  )}
                </View>

                {/* Speaker Button */}
                <Pressable
                  onPress={handleSpeakerPress}
                  disabled={isPlayingAudio || isListening}
                  className="w-8 h-8 items-center justify-center rounded-full bg-slate-50 active:bg-slate-100"
                >
                  <Animated.View style={animatedSpeakerStyle}>
                    <Ionicons
                      name="volume-high"
                      size={20}
                      color="#6C4EF5"
                    />
                  </Animated.View>
                </Pressable>
              </View>

              {/* Bubble Arrow pointing down */}
              <View
                className="absolute -bottom-2 right-[15%] w-4 h-4 bg-white rotate-45 border-r border-b border-[#F3F4F6]"
              />
            </Animated.View>
          )}

          {/* Faded Background bottom area that holds controls */}
          <View className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/40 via-black/20 to-transparent justify-end pb-3">
            {/* Audio Lesson Controls */}
            <View className="flex-row justify-around items-center px-4 w-full">
              {/* Camera Button */}
              <View className="items-center">
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setIsCameraOn(!isCameraOn);
                  }}
                  className={`w-12 h-12 rounded-full items-center justify-center shadow-md ${
                    isCameraOn ? "bg-white" : "bg-white/20 border border-white/30"
                  }`}
                >
                  <Ionicons
                    name={isCameraOn ? "videocam-outline" : "videocam-off-outline"}
                    size={20}
                    color={isCameraOn ? "#0D132B" : "#FFFFFF"}
                  />
                </Pressable>
                <Text className="text-[11px] font-poppins-medium text-white mt-1.5">
                  Camera
                </Text>
              </View>

              {/* Microphone/Speak Button */}
              <View className="items-center">
                <Animated.View style={animatedMicStyle}>
                  <Pressable
                    onPress={handleMicPress}
                    className={`w-12 h-12 rounded-full items-center justify-center shadow-md ${
                      isListening ? "bg-[#EBFDF5]" : "bg-white"
                    }`}
                  >
                    <Ionicons
                      name="mic-outline"
                      size={20}
                      color={isListening ? "#10B981" : "#0D132B"}
                    />
                  </Pressable>
                </Animated.View>
                <Text className="text-[11px] font-poppins-medium text-white mt-1.5">
                  Mic
                </Text>
              </View>

              {/* Subtitles Button */}
              <View className="items-center">
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setShowSubtitles(!showSubtitles);
                  }}
                  className={`w-12 h-12 rounded-full items-center justify-center shadow-md ${
                    showSubtitles ? "bg-white" : "bg-white/20 border border-white/30"
                  }`}
                >
                  <MaterialIcons
                    name="translate"
                    size={20}
                    color={showSubtitles ? "#0D132B" : "#FFFFFF"}
                  />
                </Pressable>
                <Text className="text-[11px] font-poppins-medium text-white mt-1.5">
                  Subtitles
                </Text>
              </View>

              {/* End Call Button */}
              <View className="items-center">
                <Pressable
                  onPress={handleEndCall}
                  className="w-12 h-12 rounded-full bg-[#FF3B30] items-center justify-center shadow-md active:bg-[#D32F2F]"
                >
                  <View style={{ transform: [{ rotate: "135deg" }] }}>
                    <Ionicons name="call" size={20} color="#FFFFFF" />
                  </View>
                </Pressable>
                <Text className="text-[11px] font-poppins-medium text-white mt-1.5">
                  End Call
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* ── FEEDBACK / SUMMARY CARD ───────────────────── */}
      <View className="mx-5 my-2 bg-[#FAF9FF] border border-[#ECE9FF] rounded-[24px] py-4 px-2 flex-row justify-between items-center shadow-sm">
        <View className="items-center flex-1 px-1">
          <Text className="text-[#0D132B] font-poppins-medium text-[11px] uppercase tracking-wider mb-0.5" numberOfLines={1}>
            Speaking
          </Text>
          <Text className="text-[#21C16B] font-poppins-bold text-[14px]" numberOfLines={1}>
            {speakingScore}
          </Text>
        </View>
        <View className="w-[1px] bg-[#ECE9FF] h-8" />
        <View className="items-center flex-1 px-1">
          <Text className="text-[#0D132B] font-poppins-medium text-[11px] uppercase tracking-wider mb-0.5" numberOfLines={1}>
            Pronunciation
          </Text>
          <Text className="text-[#2F80ED] font-poppins-bold text-[14px]" numberOfLines={1}>
            {pronunciationScore}
          </Text>
        </View>
        <View className="w-[1px] bg-[#ECE9FF] h-8" />
        <View className="items-center flex-1 px-1">
          <Text className="text-[#0D132B] font-poppins-medium text-[11px] uppercase tracking-wider mb-0.5" numberOfLines={1}>
            Grammar
          </Text>
          <Text className="text-[#9B51E0] font-poppins-bold text-[14px]" numberOfLines={1}>
            {grammarScore}
          </Text>
        </View>
      </View>

      {/* ── SESSION DETAILS MODAL ──────────────────────── */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isDetailsVisible}
        onRequestClose={() => setIsDetailsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent} className="bg-white rounded-t-[32px] p-6">
            {/* Modal Header */}
            <View className="flex-row justify-between items-center pb-4 border-b border-[#F3F4F6] mb-5">
              <Text className="text-[20px] font-poppins-bold text-[#0D132B]">
                Session Information
              </Text>
              <Pressable
                onPress={() => setIsDetailsVisible(false)}
                className="w-8 h-8 rounded-full bg-[#F3F4F6] items-center justify-center"
              >
                <Ionicons name="close" size={20} color="#6B7280" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
              {/* Student info card */}
              <View className="bg-[#FAF9FF] border border-[#ECE9FF] rounded-[24px] p-4 mb-4 flex-row items-center gap-3">
                <Image
                  source={user?.imageUrl ? { uri: user.imageUrl } : images.studentPreview}
                  className="w-12 h-12 rounded-full bg-[#E5E7EB]"
                />
                <View className="flex-1">
                  <Text className="text-[15px] font-poppins-bold text-[#0D132B]">
                    {user?.fullName || user?.username || "Student"}
                  </Text>
                  <Text className="text-[12px] font-poppins text-text-secondary">
                    {user?.emailAddresses[0]?.emailAddress || "Signed in"}
                  </Text>
                </View>
              </View>

              {/* AI Teacher Details */}
              <View className="bg-[#FAF9FF] border border-[#ECE9FF] rounded-[24px] p-5 mb-5 flex-row items-center gap-4">
                <Image
                  source={images.mascotFoxTeacher}
                  className="w-16 h-16 rounded-full bg-[#E5E7EB]"
                  resizeMode="contain"
                />
                <View className="flex-1">
                  <Text className="text-[18px] font-poppins-bold text-[#0D132B]">
                    {teacherName}
                  </Text>
                  <Text className="text-[13px] font-poppins-medium text-lingua-purple">
                    AI Native {language?.name || "Target"} Teacher {language?.flag}
                  </Text>
                </View>
              </View>

              {/* Lesson Objectives */}
              <Text className="text-[15px] font-poppins-bold text-[#0D132B] mb-2">
                Lesson Objectives
              </Text>
              <View className="bg-[#F6F7FB] rounded-2xl p-4 mb-5">
                <Text className="text-[16px] font-poppins-bold text-[#0D132B] mb-1">
                  {lesson.title}
                </Text>
                <Text className="text-[13px] font-poppins text-text-secondary mb-3 leading-5">
                  {lesson.description}
                </Text>
                <View className="gap-2">
                  {lesson.goals.map((goal, idx) => (
                    <View key={idx} className="flex-row items-center gap-2">
                      <Ionicons name="checkmark-circle-outline" size={16} color="#6C4EF5" />
                      <Text className="text-[13px] font-poppins-medium text-[#0D132B] flex-1">
                        {goal}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Phrases list */}
              <Text className="text-[15px] font-poppins-bold text-[#0D132B] mb-2">
                Phrases to Practice
              </Text>
              <View className="bg-[#F6F7FB] rounded-2xl p-4 mb-5 gap-3.5">
                {lessonPhrases.map((item, idx) => (
                  <View 
                    key={idx} 
                    className="flex-row justify-between items-start gap-4 pb-3 border-b border-[#E5E7EB]"
                    style={{ borderBottomWidth: idx === lessonPhrases.length - 1 ? 0 : 1 }}
                  >
                    <View className="flex-1">
                      <Text className="text-[15px] font-poppins-bold text-[#0D132B]">
                        {item.phrase}
                      </Text>
                      <Text className="text-[12px] font-poppins text-text-secondary mt-0.5">
                        {item.meaning}
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        Alert.alert("Practice Saying", `"${item.phrase}"`);
                      }}
                      className="w-8 h-8 rounded-full bg-[#E5E7EB] items-center justify-center active:bg-[#D1D5DB]"
                    >
                      <Ionicons name="mic-outline" size={14} color="#6B7280" />
                    </Pressable>
                  </View>
                ))}
              </View>

              {/* AI Teacher behavior prompt */}
              {lesson.activities[0]?.aiTeacherPrompt && (
                <>
                  <Text className="text-[15px] font-poppins-bold text-[#0D132B] mb-2">
                    AI Behavior Directives
                  </Text>
                  <View className="bg-[#FAF9FF] border border-[#ECE9FF] rounded-2xl p-4">
                    <Text className="text-[12px] font-poppins text-text-secondary leading-5 italic">
                      {"\""}{lesson.activities[0].aiTeacherPrompt}{"\""}
                    </Text>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  pipShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    maxHeight: "85%",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
});
