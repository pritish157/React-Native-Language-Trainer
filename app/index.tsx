import { View, Text, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { images } from "@/constants/images";

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View className="flex-1 px-6">
        {/* ── Logo + App Name ─────────────────────────── */}
        <View className="items-center pt-6 pb-4">
          <View className="flex-row items-center gap-2">
            <Image
              source={images.mascotLogo}
              className="w-10 h-10"
              resizeMode="contain"
            />
            <Text className="text-[28px] font-poppins-bold text-text-primary">
              muolingo
            </Text>
          </View>
        </View>

        {/* ── Headline ────────────────────────────────── */}
        <View className="mt-2">
          <Text className="text-[34px] leading-[1.15] font-poppins-bold text-text-primary">
            Your AI language{"\n"}
            <Text className="text-lingua-purple">teacher</Text>.
          </Text>
          <Text className="text-[16px] leading-[1.5] font-poppins text-text-secondary mt-3">
            Real conversations, personalized{"\n"}lessons, anytime, anywhere.
          </Text>
        </View>

        {/* ── Mascot + Speech Bubbles ─────────────────── */}
        <View className="flex-1 items-center justify-center">
          <View className="w-full items-center relative">
            {/* Hello bubble — top-left */}
            <View
              className="absolute left-4 bg-white rounded-2xl px-4 py-2 z-10"
              style={{
                top: 0,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <Text className="text-[18px] font-poppins-bold text-text-primary italic">
                Hello!
              </Text>
            </View>

            {/* ¡Hola! bubble — top-right */}
            <View
              className="absolute right-8 bg-white rounded-2xl px-4 py-2 z-10"
              style={{
                top: 20,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <Text className="text-[18px] font-poppins-bold text-lingua-purple italic">
                ¡Hola!
              </Text>
            </View>

            {/* 你好! bubble — right-center */}
            <View
              className="absolute right-4 rounded-2xl px-4 py-2 z-10"
              style={{
                top: 160,
                backgroundColor: "#FFF0F0",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <Text className="text-[17px] font-poppins-bold text-error italic">
                你好!
              </Text>
            </View>

            {/* Mascot image */}
            <Image
              source={images.mascotWelcome}
              className="w-72 h-72 mt-8"
              resizeMode="contain"
            />
          </View>
        </View>

        {/* ── Get Started Button ──────────────────────── */}
        <View className="pb-8 pt-4">
          <Pressable
            onPress={() => {
              // TODO: Navigate to auth or language selection
            }}
            className="bg-lingua-purple rounded-2xl py-5 flex-row items-center justify-center"
            style={({ pressed }) => ({
              opacity: pressed ? 0.9 : 1,
              shadowColor: "#6C4EF5",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.35,
              shadowRadius: 12,
              elevation: 8,
            })}
          >
            <Text className="text-[18px] font-poppins-bold text-white mr-2">
              Get Started
            </Text>
            <Text className="text-white text-[20px] font-poppins-bold">›</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
