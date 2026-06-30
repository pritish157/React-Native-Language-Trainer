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
  NativeModules,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
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
import { lessons } from "@/data/lessons";
import { languages } from "@/data/languages";
import { images } from "@/constants/images";
import { useUser } from "@clerk/expo";
import { AITeacherIcon } from "@/components/AITeacherIcon";

import type { Call, CallingState as CallingStateType } from "@stream-io/video-react-native-sdk";

const hasWebRTC = !!NativeModules.WebRTCModule;
let StreamCall: any = ({ children }: any) => <>{children}</>;
let useStreamVideoClient: any = () => null;
let useCallStateHooks: any = () => ({
  useCallCallingState: () => null,
  useMicrophoneState: () => ({ status: "enabled", isSpeakingWhileMuted: false }),
});
let CallingState: any = {
  JOINING: "joining",
  JOINED: "joined",
  RECONNECTING: "reconnecting",
  LEFT: "left",
  OFFLINE: "offline",
};

if (hasWebRTC) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const sdk = require("@stream-io/video-react-native-sdk");
    StreamCall = sdk.StreamCall;
    useStreamVideoClient = sdk.useStreamVideoClient;
    useCallStateHooks = sdk.useCallStateHooks;
    CallingState = sdk.CallingState;
  } catch (e) {
    console.warn("Failed to load Stream Video SDK dynamically in lesson screen:", e);
  }
}

// Bridge component to safely retrieve Stream call states within active context
function StreamCallStateBridge({
  children,
}: {
  children: (props: {
    callingState: CallingStateType | null;
    micStatus: any;
    isSpeakingWhileMuted: boolean;
  }) => React.ReactNode;
}) {
  const { useCallCallingState, useMicrophoneState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const { status: micStatus, isSpeakingWhileMuted } = useMicrophoneState();

  return <>{children({ callingState, micStatus, isSpeakingWhileMuted })}</>;
}

export default function AudioLessonScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useUser();
  const client = useStreamVideoClient();

  // Load selected lesson
  const lesson = useMemo(() => {
    return lessons.find((l) => l.id === id) || lessons[0];
  }, [id]);

  // Determine target language details
  const language = useMemo(() => {
    const langId = lesson.id.split("-")[0];
    return languages.find((lang) => lang.id === langId) || languages[0];
  }, [lesson]);

  // Dynamically extract phrases and vocabulary items from lesson activities
  const lessonPhrases = useMemo(() => {
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
    const langId = lesson.id.split("-")[0];
    if (langId === "es") return "Sofia";
    if (langId === "fr") return "Chloé";
    if (langId === "ja") return "Sakura";
    if (langId === "de") return "Hans";
    if (langId === "ko") return "Min-ji";
    if (langId === "it") return "Giulia";
    return "Alex";
  }, [lesson]);

  // Stream Call states
  const [call, setCall] = useState<Call | null>(null);
  const [callError, setCallError] = useState<string | null>(null);
  const [isInitializingCall, setIsInitializingCall] = useState(false);

  const callId = useMemo(() => {
    if (!lesson || !user) return "";
    const sanitizedUserId = user.id.replace(/[^a-zA-Z0-9-_]/g, "");
    return `audio-${lesson.id}-${sanitizedUserId}`;
  }, [lesson, user]);

  useEffect(() => {
    if (!client || !callId || !user) return;

    let active = true;
    let joinedCall: Call | null = null;

    const startStreamCall = async () => {
      setIsInitializingCall(true);
      setCallError(null);
      try {
        // 1. Create the call on the backend using the API route
        const response = await fetch("/api/create-call", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            callId,
            userId: user.id,
            lessonId: lesson.id,
            languageId: language.id,
            goals: lesson.goals,
            vocabulary: lessonPhrases.map((v) => v.phrase),
            phrases: lessonPhrases.map((v) => `${v.phrase}:${v.meaning}`),
            aiTeacherPrompt: lesson.activities[0]?.aiTeacherPrompt || "",
            callType: "audio_room",
          }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || `HTTP error! status: ${response.status}`);
        }

        if (!active) return;

        // 2. Initialize the Call instance locally with reuseInstance: true
        const c = client.call("audio_room", callId, { reuseInstance: true });
        joinedCall = c;
        setCall(c);

        // 3. Join the call
        await c.join({ create: true });
        
        if (active) {
          console.log("Joined Stream Call successfully:", callId);
        }
      } catch (err: any) {
        console.error("Failed to start or join Stream call:", err);
        if (active) {
          setCallError(err.message || "Failed to initialize call");
        }
      } finally {
        if (active) {
          setIsInitializingCall(false);
        }
      }
    };

    startStreamCall();

    return () => {
      active = false;
      if (joinedCall) {
        // Leave call if not left already
        const cState = joinedCall.state;
        if (cState.callingState !== CallingState.LEFT) {
          joinedCall.leave().catch((e) => console.error("Error leaving call on unmount:", e));
        }
      }
    };
  }, [client, callId, user, lesson, language, lessonPhrases]);

  if (call) {
    return (
      <StreamCall call={call}>
        <StreamCallStateBridge>
          {({ callingState, micStatus, isSpeakingWhileMuted }) => (
            <AudioLessonScreenContent
              lesson={lesson}
              language={language}
              lessonPhrases={lessonPhrases}
              teacherName={teacherName}
              call={call}
              isInitializingCall={isInitializingCall}
              callError={callError}
              callingState={callingState}
              micStatus={micStatus}
              isSpeakingWhileMuted={isSpeakingWhileMuted}
            />
          )}
        </StreamCallStateBridge>
      </StreamCall>
    );
  }

  return (
    <AudioLessonScreenContent
      lesson={lesson}
      language={language}
      lessonPhrases={lessonPhrases}
      teacherName={teacherName}
      call={null}
      isInitializingCall={isInitializingCall}
      callError={callError}
      callingState={null}
      micStatus={null}
      isSpeakingWhileMuted={false}
    />
  );
}

interface AudioLessonScreenContentProps {
  lesson: any;
  language: any;
  lessonPhrases: { phrase: string; meaning: string }[];
  teacherName: string;
  call: Call | null;
  isInitializingCall: boolean;
  callError: string | null;
  callingState: CallingStateType | null;
  micStatus: any;
  isSpeakingWhileMuted: boolean;
}

function AudioLessonScreenContent({
  lesson,
  language,
  lessonPhrases,
  teacherName,
  call,
  isInitializingCall,
  callError,
  callingState,
  micStatus,
  isSpeakingWhileMuted,
}: AudioLessonScreenContentProps) {
  const router = useRouter();
  const { completeLesson, addXp, streak } = useProgressStore();
  const { user } = useUser();
  const insets = useSafeAreaInsets();

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

  // Dynamic teacher greeting sequence on mount
  const startGreetingSequence = useCallback(() => {
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

        // Update scores randomly with high ratings
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
                onPress: async () => {
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  completeLesson(lesson.id);
                  addXp(lesson.xpReward);
                  if (call) {
                    try {
                      if (callingState !== CallingState.LEFT) {
                        await call.leave();
                      }
                    } catch (e) {
                      console.error("Error leaving call on completion:", e);
                    }
                  }
                  router.replace("/(tabs)/learn");
                },
              },
            ]
          );
        }
      }, 1500);
    }, 2000);
  };

  // Mute/Unmute toggle for real-time call
  const handleMuteToggle = async () => {
    if (!call) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      Alert.alert("Simulated Mic Mute", "A real-time Stream call is not active in this environment.");
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await call.microphone.toggle();
    } catch (e) {
      console.error("Failed to toggle microphone state:", e);
    }
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
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            if (call) {
              try {
                if (callingState !== CallingState.LEFT) {
                  await call.leave();
                }
              } catch (e) {
                console.error("Error leaving call:", e);
              }
            }
            router.replace("/(tabs)/learn");
          },
        },
      ]
    );
  };

  // Replica bottom tab bar navigation warning
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
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            if (call) {
              try {
                if (callingState !== CallingState.LEFT) {
                  await call.leave();
                }
              } catch (e) {
                console.error("Error leaving call:", e);
              }
            }
            router.replace(routePath as any);
          },
        },
      ]
    );
  };

  // Determine display status info
  const statusInfo = useMemo(() => {
    if (callError) {
      return {
        text: "Error",
        subText: callError,
        color: "#FF3B30", // Red
        badge: "ERROR",
      };
    }
    if (isInitializingCall) {
      return {
        text: "Connecting...",
        subText: "Setting up audio room...",
        color: "#F2C94C", // Yellow
        badge: "CONNECTING",
      };
    }
    if (call) {
      switch (callingState) {
        case CallingState.JOINING:
          return {
            text: "Connecting...",
            subText: "Joining audio room...",
            color: "#F2C94C",
            badge: "JOINING",
          };
        case CallingState.JOINED:
          if (micStatus === "disabled") {
            return {
              text: "Muted",
              subText: "Your microphone is muted",
              color: "#9B51E0", // Purple
              badge: "MUTED",
            };
          }
          return {
            text: "Joined",
            subText: "Connected to audio room",
            color: "#21C16B", // Green
            badge: "JOINED",
          };
        case CallingState.RECONNECTING:
          return {
            text: "Reconnecting...",
            subText: "Connection lost, retrying...",
            color: "#F2C94C",
            badge: "RECONNECTING",
          };
        case CallingState.LEFT:
          return {
            text: "Ended",
            subText: "Call has ended",
            color: "#8B8FA3", // Gray
            badge: "LEFT",
          };
        case CallingState.OFFLINE:
          return {
            text: "Offline",
            subText: "No network connection",
            color: "#FF3B30",
            badge: "OFFLINE",
          };
        default:
          return {
            text: "Connecting...",
            subText: "Connecting...",
            color: "#F2C94C",
            badge: "CONNECTING",
          };
      }
    }

    // Fallback simulated values
    return {
      text: sessionStatus === "Connecting..." ? "Connecting..." : "Online",
      subText: sessionStatus,
      color: sessionStatus === "Connecting..." ? "#F2C94C" : "#21C16B",
      badge: sessionStatus === "Connecting..." ? "CONNECTING" : "ONLINE",
    };
  }, [call, callingState, micStatus, isInitializingCall, callError, sessionStatus]);

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

  return (
    <View className="flex-1 bg-white justify-between">
      {/* ── TOP HEADER ─────────────────────────── */}
      <SafeAreaView edges={["top"]} style={{ backgroundColor: "#FFFFFF" }}>
        <View className="flex-row items-center justify-between px-5 pt-3 pb-3 border-b border-[#F3F4F6] bg-white">
          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={handleEndCall}
              className="w-8 h-8 items-center justify-center active:opacity-75"
            >
              <Ionicons name="chevron-back" size={26} color="#0D132B" style={{ marginLeft: -6 }} />
            </Pressable>
            <View>
              <Text className="text-[20px] font-poppins-bold text-[#0D132B] leading-6">
                AI Teacher
              </Text>
              <View className="flex-row items-center gap-1.5 mt-0.5">
                <View 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: statusInfo.color }}
                />
                <Text className="text-[12px] font-poppins text-text-secondary">
                  {statusInfo.text}
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
                name={isCameraOn ? "videocam-outline" : "videocam-off-outline"}
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
            {isListening || isPlayingAudio || isInitializingCall || (call && callingState === CallingState.JOINING) ? (
              <View className="flex-row gap-0.5 items-center">
                <View className="w-1 h-2.5 bg-white rounded-full animate-pulse" />
                <View className="w-1 h-3.5 bg-white rounded-full" />
                <View className="w-1 h-2 bg-white rounded-full animate-pulse" />
              </View>
            ) : (
              <View 
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: statusInfo.color }}
              />
            )}
            <Text className="text-[10px] font-poppins-bold text-white uppercase tracking-wider">
              {statusInfo.badge}
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
              <View className="absolute bottom-1 left-1 right-1 bg-black/50 rounded px-1 py-0.5">
                <Text className="text-[8px] font-poppins-bold text-white text-center" numberOfLines={1}>
                  {user?.firstName || user?.username || "You"}
                </Text>
              </View>
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

          {/* Speaking while muted notification toast */}
          {isSpeakingWhileMuted && (
            <View className="absolute bottom-[245px] left-4 right-4 bg-lingua-purple rounded-2xl p-3 z-50 shadow-lg flex-row items-center justify-center gap-2 border border-[#ECE9FF]">
              <Ionicons name="mic-off" size={16} color="white" />
              <Text className="text-white font-poppins-bold text-[11px]">
                You are speaking while muted! Tap Unmute to be heard.
              </Text>
            </View>
          )}

          {/* Compact Speech Bubble (Subtitles must not cover background image completely) */}
          {bubbleText !== "" && (
            <Animated.View
              style={[animatedBubbleStyle]}
              className="absolute bottom-[98px] left-4 right-4 bg-white rounded-[24px] p-4 shadow-lg border border-[#F3F4F6] z-30"
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
            <View className="flex-row justify-around items-center px-2 w-full">
              {/* Mute/Unmute Button */}
              <View className="items-center">
                <Pressable
                  onPress={handleMuteToggle}
                  className={`w-11 h-11 rounded-full items-center justify-center shadow-md ${
                    micStatus === "disabled" ? "bg-[#FF3B30]/90" : "bg-white"
                  }`}
                >
                  <Ionicons
                    name={micStatus === "disabled" ? "mic-off-outline" : "mic-outline"}
                    size={18}
                    color={micStatus === "disabled" ? "#FFFFFF" : "#0D132B"}
                  />
                </Pressable>
                <Text className="text-[10px] font-poppins-medium text-white mt-1.5 text-center">
                  {micStatus === "disabled" ? "Unmute" : "Mute"}
                </Text>
              </View>

              {/* Practice Button */}
              <View className="items-center">
                <Animated.View style={animatedMicStyle}>
                  <Pressable
                    onPress={handleMicPress}
                    className={`w-11 h-11 rounded-full items-center justify-center shadow-md ${
                      isListening ? "bg-[#EBFDF5]" : "bg-white"
                    }`}
                  >
                    <Ionicons
                      name="chatbubbles-outline"
                      size={18}
                      color={isListening ? "#10B981" : "#0D132B"}
                    />
                  </Pressable>
                </Animated.View>
                <Text className="text-[10px] font-poppins-medium text-white mt-1.5 text-center">
                  Practice
                </Text>
              </View>

              {/* Camera Button */}
              <View className="items-center">
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setIsCameraOn(!isCameraOn);
                  }}
                  className={`w-11 h-11 rounded-full items-center justify-center shadow-md ${
                    isCameraOn ? "bg-white" : "bg-white/20 border border-white/30"
                  }`}
                >
                  <Ionicons
                    name={isCameraOn ? "videocam-outline" : "videocam-off-outline"}
                    size={18}
                    color={isCameraOn ? "#0D132B" : "#FFFFFF"}
                  />
                </Pressable>
                <Text className="text-[10px] font-poppins-medium text-white mt-1.5 text-center">
                  Camera
                </Text>
              </View>

              {/* Subtitles Button */}
              <View className="items-center">
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setShowSubtitles(!showSubtitles);
                  }}
                  className={`w-11 h-11 rounded-full items-center justify-center shadow-md ${
                    showSubtitles ? "bg-white" : "bg-white/20 border border-white/30"
                  }`}
                >
                  <MaterialIcons
                    name="translate"
                    size={18}
                    color={showSubtitles ? "#0D132B" : "#FFFFFF"}
                  />
                </Pressable>
                <Text className="text-[10px] font-poppins-medium text-white mt-1.5 text-center">
                  Subtitles
                </Text>
              </View>

              {/* End Call Button */}
              <View className="items-center">
                <Pressable
                  onPress={handleEndCall}
                  className="w-11 h-11 rounded-full bg-[#FF3B30] items-center justify-center shadow-md active:bg-[#D32F2F]"
                >
                  <View style={{ transform: [{ rotate: "135deg" }] }}>
                    <Ionicons name="call" size={18} color="#FFFFFF" />
                  </View>
                </Pressable>
                <Text className="text-[10px] font-poppins-medium text-white mt-1.5 text-center">
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

      {/* ── BOTTOM TAB BAR REPLICA ─────────────────────── */}
      <View style={[styles.tabBarContainer, { paddingBottom: insets.bottom > 0 ? insets.bottom : 6 }]}>
        <View className="flex-row h-full">
          <Pressable onPress={() => handleTabPress("/(tabs)/")} style={styles.tabItem}>
            <Ionicons name="home-outline" size={24} color="#8B8FA3" />
            <Text className="text-[10px] font-poppins-medium text-[#8B8FA3] mt-1">
              Home
            </Text>
          </Pressable>

          <Pressable onPress={() => handleTabPress("/(tabs)/learn")} style={styles.tabItem}>
            <Ionicons name="book" size={24} color="#6C4EF5" />
            <Text className="text-[10px] font-poppins-bold text-[#6C4EF5] mt-1">
              Learn
            </Text>
          </Pressable>

          <Pressable onPress={() => handleTabPress("/(tabs)/ai-teacher")} style={styles.tabItem}>
            <AITeacherIcon color="#8B8FA3" size={24} />
            <Text className="text-[10px] font-poppins-medium text-[#8B8FA3] mt-1">
              AI Teacher
            </Text>
          </Pressable>

          <Pressable onPress={() => handleTabPress("/(tabs)/chat")} style={styles.tabItem}>
            <Ionicons name="chatbubble-outline" size={24} color="#8B8FA3" />
            <Text className="text-[10px] font-poppins-medium text-[#8B8FA3] mt-1">
              Chat
            </Text>
          </Pressable>

          <Pressable onPress={() => handleTabPress("/(tabs)/profile")} style={styles.tabItem}>
            <Ionicons name="person-outline" size={24} color="#8B8FA3" />
            <Text className="text-[10px] font-poppins-medium text-[#8B8FA3] mt-1">
              Profile
            </Text>
          </Pressable>
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

              {/* Stream Call Status */}
              {call && (
                <>
                  <Text className="text-[15px] font-poppins-bold text-[#0D132B] mb-2">
                    Stream Call Connection
                  </Text>
                  <View className="bg-[#FAF9FF] border border-[#ECE9FF] rounded-[24px] p-4 mb-4 gap-2">
                    <View className="flex-row justify-between items-center">
                      <Text className="text-[13px] font-poppins text-text-secondary">Call ID:</Text>
                      <Text className="text-[13px] font-poppins-bold text-[#0D132B]" numberOfLines={1}>{call.id}</Text>
                    </View>
                    <View className="flex-row justify-between items-center">
                      <Text className="text-[13px] font-poppins text-text-secondary">Type:</Text>
                      <Text className="text-[13px] font-poppins-medium text-[#0D132B]">Audio Room</Text>
                    </View>
                    <View className="flex-row justify-between items-center">
                      <Text className="text-[13px] font-poppins text-text-secondary">Status:</Text>
                      <View className="flex-row items-center gap-1.5">
                        <View className="w-2 h-2 rounded-full" style={{ backgroundColor: statusInfo.color }} />
                        <Text className="text-[13px] font-poppins-bold" style={{ color: statusInfo.color }}>
                          {statusInfo.text}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row justify-between items-center">
                      <Text className="text-[13px] font-poppins text-text-secondary">Microphone:</Text>
                      <Text className="text-[13px] font-poppins-medium text-[#0D132B]">
                        {micStatus === "disabled" ? "Muted" : "Active"}
                      </Text>
                    </View>
                  </View>
                </>
              )}

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
                  {lesson.goals.map((goal: string, idx: number) => (
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
  tabBarContainer: {
    height: 70,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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

