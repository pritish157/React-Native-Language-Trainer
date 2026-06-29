import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  Alert,
  StyleSheet,
  ActivityIndicator,
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

import { useLanguageStore } from "@/store/useLanguageStore";
import { useProgressStore } from "@/store/useProgressStore";
import { images } from "@/constants/images";
import { lessons } from "@/data/lessons";
import { languages } from "@/data/languages";

export default function AiTeacherScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const lessonId = params.lessonId;

  const { selectedLanguageId } = useLanguageStore();
  const { streak, completeLesson, addXp, completedLessonIds } = useProgressStore();

  // Load lesson based on route param or fallback
  const lesson = useMemo(() => {
    // If a specific lesson ID is passed via search params
    if (lessonId && typeof lessonId === "string") {
      return lessons.find((l) => l.id === lessonId) || null;
    }
    
    // Fallback: get lessons for selected language
    const langId = selectedLanguageId || "es";
    const languageLessons = lessons.filter((l) => l.id.startsWith(langId));
    
    // Find first incomplete lesson
    const incomplete = languageLessons.find((l) => !completedLessonIds.includes(l.id));
    if (incomplete) return incomplete;
    
    // If all completed, return first lesson
    return languageLessons[0] || lessons[0];
  }, [lessonId, selectedLanguageId, completedLessonIds]);

  const language = useMemo(() => {
    if (!lesson) return null;
    const langId = lesson.id.split("-")[0];
    return languages.find((lang) => lang.id === langId) || null;
  }, [lesson]);

  // Screen interactive state
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);

  // Conversation simulation state
  const [sessionStatus, setSessionStatus] = useState("Connecting...");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [bubbleText, setBubbleText] = useState("");
  const [bubbleTranslation, setBubbleTranslation] = useState("");
  const [interactionStep, setInteractionStep] = useState<"greeting" | "listen" | "speak" | "feedback">("greeting");

  // Performance feedback scores (simulated)
  const [speakingScore, setSpeakingScore] = useState("Excellent");
  const [pronunciationScore, setPronunciationScore] = useState("Great");
  const [grammarScore, setGrammarScore] = useState("Good");

  // Reanimated values for animations
  const bubbleScale = useSharedValue(0);
  const bubbleTranslateY = useSharedValue(20);
  const soundwaveScale = useSharedValue(1);
  const pulseScale = useSharedValue(1);

  // Extract vocabulary and phrases from lesson data
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

  // Simulated AI dialog stages
  const startGreetingSequence = useCallback(() => {
    setInteractionStep("greeting");
    const teacherName = lesson?.id.includes("es") ? "Sofia" : "Chloé";
    setSessionStatus(`${teacherName} is speaking...`);
    setBubbleText(`¡Hola! Welcome to your lesson. I am ${teacherName}. Let's learn!`);
    setBubbleTranslation(`Hello! Welcome to your lesson. I am ${teacherName}. Let's learn!`);
  }, [lesson]);

  // Reset interactive simulation when lesson changes
  useEffect(() => {
    setIsConnected(false);
    setInteractionStep("greeting");
    setPhraseIndex(0);
    setSpeakingScore("Excellent");
    setPronunciationScore("Great");
    setGrammarScore("Good");

    const timer = setTimeout(() => {
      setIsConnected(true);
      setSessionStatus("Online");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      startGreetingSequence();
    }, 1500);

    return () => clearTimeout(timer);
  }, [lesson, startGreetingSequence]);

  // Animate speech bubble in when visible
  useEffect(() => {
    if (isConnected && showSubtitles) {
      bubbleScale.value = withSpring(1, { damping: 12 });
      bubbleTranslateY.value = withSpring(0, { damping: 12 });
    } else {
      bubbleScale.value = withTiming(0, { duration: 200 });
      bubbleTranslateY.value = withTiming(20, { duration: 200 });
    }
  }, [isConnected, showSubtitles, bubbleScale, bubbleTranslateY]);

  // Pulsating animation for volume/mic when active
  useEffect(() => {
    if (isPlayingAudio) {
      soundwaveScale.value = withRepeat(
        withSequence(
          withTiming(1.3, { duration: 200 }),
          withTiming(1.0, { duration: 200 })
        ),
        -1,
        true
      );
    } else {
      cancelAnimation(soundwaveScale);
      soundwaveScale.value = 1;
    }
  }, [isPlayingAudio, soundwaveScale]);

  // Loop a gentle pulse for the mic button when user needs to speak
  useEffect(() => {
    if (interactionStep === "speak" && !isMuted) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 600 }),
          withTiming(1.0, { duration: 600 })
        ),
        -1,
        true
      );
    } else {
      cancelAnimation(pulseScale);
      pulseScale.value = 1;
    }
  }, [interactionStep, isMuted, pulseScale]);

  const handleSpeakerPress = () => {
    if (isPlayingAudio) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsPlayingAudio(true);
    const teacherName = lesson?.id.includes("es") ? "Sofia" : "Chloé";
    setSessionStatus(`${teacherName} is speaking...`);

    // Simulated audio playback time
    setTimeout(() => {
      setIsPlayingAudio(false);
      
      // If we were in greeting, move to the first phrase
      if (interactionStep === "greeting") {
        setInteractionStep("listen");
        const item = lessonPhrases[phraseIndex];
        setBubbleText(item.phrase);
        setBubbleTranslation(item.meaning);
        setSessionStatus(`Listen to the teacher`);
      } else if (interactionStep === "listen") {
        // Invite the user to speak
        setInteractionStep("speak");
        setSessionStatus("Listening to you...");
      }
    }, 2500);
  };

  const handleMicPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // If muted/unmuted toggle
    if (interactionStep !== "speak") {
      setIsMuted(!isMuted);
      return;
    }

    if (isMuted) {
      Alert.alert("Microphone Muted", "Please unmute your microphone to practice speaking.");
      return;
    }

    // Simulate user speaking recording
    setSessionStatus("Recording your voice...");
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Animate speech detection
    setTimeout(() => {
      setSessionStatus("Analyzing pronunciation...");
      
      setTimeout(() => {
        // Move to feedback stage
        setInteractionStep("feedback");
        setSessionStatus("Online");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Update scores to reflect simulated output
        setSpeakingScore("Excellent");
        setPronunciationScore("Great");
        setGrammarScore("Good");

        // Set the success bubble text
        const langId = lesson?.id.split("-")[0];
        if (langId === "es") {
          setBubbleText("¡Muy bien!");
          setBubbleTranslation("That was great! 👏");
        } else if (langId === "fr") {
          setBubbleText("Très bien !");
          setBubbleTranslation("That was great! 👏");
        } else {
          setBubbleText("Excellent!");
          setBubbleTranslation("That was great! 👏");
        }
      }, 1500);
    }, 2000);
  };

  const nextPhrase = () => {
    if (phraseIndex < lessonPhrases.length - 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const nextIdx = phraseIndex + 1;
      setPhraseIndex(nextIdx);
      setInteractionStep("listen");
      const item = lessonPhrases[nextIdx];
      setBubbleText(item.phrase);
      setBubbleTranslation(item.meaning);
      setSessionStatus(`Listen to the teacher`);
    } else {
      // Completed all phrases
      Alert.alert(
        "Lesson Finished!",
        "You have completed all the exercises in this session. Tap End Call to save your progress.",
        [{ text: "OK" }]
      );
    }
  };

  const handleEndCall = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      "End Lesson",
      "Would you like to finish the lesson and earn rewards, or exit without saving?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Exit Lesson",
          style: "destructive",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            router.replace("/(tabs)/learn");
          },
        },
        {
          text: "Complete Lesson",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            if (lesson) {
              completeLesson(lesson.id);
              addXp(lesson.xpReward);
              Alert.alert(
                "Congratulations!",
                `You completed "${lesson.title}" and earned +${lesson.xpReward} XP!`,
                [
                  {
                    text: "Great!",
                    onPress: () => {
                      router.replace("/(tabs)/learn");
                    },
                  },
                ]
              );
            } else {
              router.replace("/(tabs)/learn");
            }
          },
        },
      ]
    );
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace("/(tabs)/learn");
  };

  // Animated styles
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

  if (!lesson) {
    return (
      <SafeAreaView style={styles.safeArea}>
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
      {/* ── HEADER BAR ── */}
      <SafeAreaView edges={["top"]} style={{ backgroundColor: "#FFFFFF" }}>
        <View className="flex-row items-center justify-between px-5 pt-3 pb-3 border-b border-[#F3F4F6] bg-white">
          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={handleBack}
              className="w-8 h-8 items-center justify-center active:opacity-70"
            >
              <Ionicons name="chevron-back" size={26} color="#0D132B" style={{ marginLeft: -6 }} />
            </Pressable>
            <View>
              <Text className="text-[20px] font-poppins-bold text-text-primary leading-6">
                AI Teacher
              </Text>
              <View className="flex-row items-center gap-1.5 mt-0.5">
                <View className="w-2.5 h-2.5 rounded-full bg-[#21C16B]" />
                <Text className="text-[13px] font-poppins-medium text-text-secondary">
                  {isConnected ? "Online" : "Connecting..."}
                </Text>
              </View>
            </View>
          </View>

          {/* Right Header Icons */}
          <View className="flex-row items-center gap-2">
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

            {/* Streak Badge (Number 12 without fire, matching base image) */}
            <View className="w-10 h-10 rounded-full border border-[#E5E7EB] bg-white items-center justify-center">
              <Text className="text-[16px] font-poppins-medium text-text-primary">
                {streak}
              </Text>
            </View>

            {/* Profile Silhouette Details Trigger */}
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

      {/* ── MAIN WORKSPACE ── */}
      <View className="flex-1 relative mx-5 mt-4 mb-4 rounded-[32px] overflow-hidden border border-[#E5E7EB] bg-[#F3F4F6]">
        {/* Integrated mascot and cozy room background */}
        <Image
          source={images.mascotAndRoom}
          className="absolute inset-0 w-full h-full"
          resizeMode="cover"
        />

        {!isConnected && (
          <View className="absolute inset-0 items-center justify-center bg-black/15">
            <ActivityIndicator size="large" color="#6C4EF5" />
          </View>
        )}

        {/* Small PIP Window (upper right corner) */}
        {isCameraOn && (
          <View className="absolute top-4 right-4 w-24 h-32 rounded-2xl border-2 border-white overflow-hidden shadow-lg bg-gray-200">
            <Image
              source={images.studentPreview}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        )}

        {/* Interactive Speech Bubble */}
        {isConnected && showSubtitles && (
          <Animated.View
            style={[animatedBubbleStyle]}
            className="absolute bottom-[16px] left-[16px] right-[16px] bg-white rounded-[24px] p-5 shadow-md border border-[#F3F4F6] z-30"
          >
            <View className="flex-row items-center justify-between gap-3">
              <View className="flex-1">
                {interactionStep === "speak" && (
                  <Text className="text-[11px] font-poppins-bold text-lingua-purple uppercase tracking-wider mb-0.5">
                    Repeat:
                  </Text>
                )}
                <Text className="text-[19px] font-poppins-bold text-text-primary leading-6">
                  {bubbleText}
                </Text>
                <Text className="text-[14px] font-poppins text-text-secondary mt-1 leading-5">
                  {bubbleTranslation}
                </Text>
              </View>

              {/* Blue Speaker Icon (no circle border/background, matching base image) */}
              <Pressable
                onPress={handleSpeakerPress}
                disabled={isPlayingAudio}
                className="p-1 items-center justify-center active:opacity-70"
              >
                <Animated.View style={animatedSpeakerStyle}>
                  <Ionicons
                    name={isPlayingAudio ? "volume-high" : "volume-medium"}
                    size={24}
                    color="#6C4EF5"
                  />
                </Animated.View>
              </Pressable>
            </View>

            {/* Bubble arrow / pointer (pointing bottom-right, matching base image) */}
            <View
              className="absolute -bottom-2 right-[15%] w-4 h-4 bg-white rotate-45 border-r border-b border-[#F3F4F6]"
            />
          </Animated.View>
        )}

        {/* Floating status badge inside workspace */}
        <View className="absolute top-4 left-4 bg-black/40 rounded-full px-3 py-1.5 flex-row items-center gap-1.5">
          {isPlayingAudio || interactionStep === "speak" ? (
            <View className="flex-row gap-0.5 items-center">
              <View className="w-1.5 h-3 bg-white rounded-full animate-pulse" />
              <View className="w-1.5 h-4 bg-white rounded-full" />
              <View className="w-1.5 h-2.5 bg-white rounded-full animate-pulse" />
            </View>
          ) : (
            <Ionicons name="mic-outline" size={12} color="#FFFFFF" />
          )}
          <Text className="text-[11px] font-poppins-bold text-white uppercase tracking-wider">
            {sessionStatus}
          </Text>
        </View>

        {/* Cycle phrase helper button when in feedback stage */}
        {interactionStep === "feedback" && phraseIndex < lessonPhrases.length - 1 && (
          <Pressable
            onPress={nextPhrase}
            className="absolute bottom-[165px] right-4 bg-lingua-purple px-4 py-2 rounded-full flex-row items-center gap-1 shadow-lg active:opacity-90 z-40"
          >
            <Text className="text-white font-poppins-bold text-[12px]">Next Phrase</Text>
            <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
          </Pressable>
        )}
      </View>

      {/* ── AUDIO CONTROLS PANEL ── */}
      <View className="flex-row justify-around items-center px-4 py-3 bg-white border-b border-[#F3F4F6]">
        {/* Toggle Camera Button */}
        <View className="items-center">
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setIsCameraOn(!isCameraOn);
            }}
            className={`w-16 h-16 rounded-full items-center justify-center shadow-sm border ${
              isCameraOn ? "bg-white border-[#E5E7EB]" : "bg-[#FFF0F0] border-error"
            }`}
          >
            <Ionicons
              name={isCameraOn ? "videocam" : "videocam-off"}
              size={24}
              color={isCameraOn ? "#0D132B" : "#FF4D4F"}
            />
          </Pressable>
          <Text className="text-[12px] font-poppins-medium text-text-secondary mt-2">
            Camera
          </Text>
        </View>

        {/* Toggle Microphone Button */}
        <View className="items-center">
          <Animated.View style={animatedMicStyle}>
            <Pressable
              onPress={handleMicPress}
              className={`w-16 h-16 rounded-full items-center justify-center shadow-sm border ${
                interactionStep === "speak" && !isMuted
                  ? "bg-[#EBFDF5] border-[#10B981]"
                  : isMuted
                  ? "bg-[#FFF0F0] border-error"
                  : "bg-white border-[#E5E7EB]"
              }`}
            >
              <Ionicons
                name={isMuted ? "mic-off" : "mic"}
                size={24}
                color={
                  interactionStep === "speak" && !isMuted
                    ? "#10B981"
                    : isMuted
                    ? "#FF4D4F"
                    : "#0D132B"
                }
              />
            </Pressable>
          </Animated.View>
          <Text className="text-[12px] font-poppins-medium text-text-secondary mt-2">
            Mic
          </Text>
        </View>

        {/* Toggle Subtitles Button */}
        <View className="items-center">
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowSubtitles(!showSubtitles);
            }}
            className={`w-16 h-16 rounded-full items-center justify-center shadow-sm border ${
              showSubtitles ? "bg-white border-[#E5E7EB]" : "bg-[#F3F4F6] border-border"
            }`}
          >
            <MaterialIcons
              name="translate"
              size={24}
              color={showSubtitles ? "#0D132B" : "#9CA3AF"}
            />
          </Pressable>
          <Text className="text-[12px] font-poppins-medium text-text-secondary mt-2">
            Subtitles
          </Text>
        </View>

        {/* End Call Button */}
        <View className="items-center">
          <Pressable
            onPress={handleEndCall}
            className="w-16 h-16 rounded-full bg-[#FF3B30] items-center justify-center shadow-md active:opacity-90"
          >
            <View style={{ transform: [{ rotate: "135deg" }] }}>
              <Ionicons name="call" size={24} color="#FFFFFF" />
            </View>
          </Pressable>
          <Text className="text-[12px] font-poppins-medium text-text-secondary mt-2">
            End Call
          </Text>
        </View>
      </View>

      {/* ── ANALYSIS / FEEDBACK SUMMARY CARD ── */}
      <View className="mx-5 my-4 bg-[#FAF9FF] border border-[#ECE9FF] rounded-[24px] py-4 px-2 flex-row justify-between items-center shadow-sm shadow-[#6C4EF5]/5">
        <View className="items-center flex-1 px-1">
          <Text className="text-[#0D132B] font-poppins-medium text-[12px] uppercase tracking-wider mb-0.5" numberOfLines={1}>
            Speaking
          </Text>
          <Text className="text-[#21C16B] font-poppins-bold text-[15px]" numberOfLines={1}>
            {speakingScore}
          </Text>
        </View>
        <View className="w-[1px] bg-[#ECE9FF] h-8" />
        <View className="items-center flex-1 px-1">
          <Text className="text-[#0D132B] font-poppins-medium text-[12px] uppercase tracking-wider mb-0.5" numberOfLines={1}>
            Pronunciation
          </Text>
          <Text className="text-[#2F80ED] font-poppins-bold text-[15px]" numberOfLines={1}>
            {pronunciationScore}
          </Text>
        </View>
        <View className="w-[1px] bg-[#ECE9FF] h-8" />
        <View className="items-center flex-1 px-1">
          <Text className="text-[#0D132B] font-poppins-medium text-[12px] uppercase tracking-wider mb-0.5" numberOfLines={1}>
            Grammar
          </Text>
          <Text className="text-[#9B51E0] font-poppins-bold text-[15px]" numberOfLines={1}>
            {grammarScore}
          </Text>
        </View>
      </View>

      {/* ── TEACHER / LESSON INFORMATION OVERLAY MODAL ── */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isDetailsVisible}
        onRequestClose={() => setIsDetailsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent} className="bg-white rounded-t-[32px] p-6 shadow-2xl">
            <View className="flex-row justify-between items-center pb-4 border-b border-[#F3F4F6] mb-5">
              <Text className="text-[20px] font-poppins-bold text-text-primary">
                Session Information
              </Text>
              <Pressable
                onPress={() => setIsDetailsVisible(false)}
                className="w-8 h-8 rounded-full bg-[#F3F4F6] items-center justify-center"
              >
                <Ionicons name="close" size={20} color="#6B7280" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
              {/* Teacher Info Card */}
              <View className="bg-[#FAF9FF] border border-[#ECE9FF] rounded-[24px] p-5 mb-5 flex-row items-center gap-4">
                <Image
                  source={images.mascotFoxTeacher}
                  className="w-16 h-16 rounded-full bg-[#E5E7EB]"
                  resizeMode="contain"
                />
                <View className="flex-1">
                  <Text className="text-[18px] font-poppins-bold text-text-primary">
                    {lesson?.id.includes("es") ? "Sofia" : "Chloé"}
                  </Text>
                  <Text className="text-[13px] font-poppins-medium text-lingua-purple">
                    AI Native {language?.name || "Target Language"} Teacher
                  </Text>
                </View>
              </View>

              {/* Lesson Objectives */}
              <Text className="text-[15px] font-poppins-bold text-text-primary mb-2">
                Lesson Objectives
              </Text>
              <View className="bg-[#F6F7FB] rounded-2xl p-4 mb-5">
                <Text className="text-[16px] font-poppins-bold text-text-primary mb-1">
                  {lesson.title}
                </Text>
                <Text className="text-[13px] font-poppins text-text-secondary mb-3 leading-5">
                  {lesson.description}
                </Text>
                <View className="gap-2">
                  {lesson.goals.map((goal, idx) => (
                    <View key={idx} className="flex-row items-center gap-2">
                      <Ionicons name="checkmark-circle-outline" size={16} color="#6C4EF5" />
                      <Text className="text-[13px] font-poppins-medium text-text-primary flex-1">
                        {goal}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Lesson Vocabulary / Phrases */}
              <Text className="text-[15px] font-poppins-bold text-text-primary mb-2">
                Phrases to Practice
              </Text>
              <View className="bg-[#F6F7FB] rounded-2xl p-4 mb-5 gap-3.5">
                {lessonPhrases.map((item, idx) => (
                  <View key={idx} className="flex-row justify-between items-start gap-4 pb-3 border-b border-[#E5E7EB] last:border-b-0">
                    <View className="flex-1">
                      <Text className="text-[15px] font-poppins-bold text-text-primary">
                        {item.phrase}
                      </Text>
                      <Text className="text-[12px] font-poppins text-text-secondary mt-0.5">
                        {item.meaning}
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        Alert.alert("Target Phrase", `Practice saying: "${item.phrase}"`);
                      }}
                      className="w-8 h-8 rounded-full bg-[#E5E7EB] items-center justify-center"
                    >
                      <Ionicons name="mic" size={14} color="#6B7280" />
                    </Pressable>
                  </View>
                ))}
              </View>

              {/* AI Prompts / Context */}
              <Text className="text-[15px] font-poppins-bold text-text-primary mb-2">
                AI Behavior Directives
              </Text>
              <View className="bg-[#FAF9FF] border border-[#ECE9FF] rounded-2xl p-4">
                <Text className="text-[12px] font-poppins text-text-secondary leading-5 italic">
                  {"\""}{lesson.activities[0]?.aiTeacherPrompt || "You are a friendly language instructor focused on pronunciation and sentence construction."}{"\""}
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
