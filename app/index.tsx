import { View, Text, Pressable, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { images } from "@/constants/images";
import { useAuth, useUser } from "@clerk/expo";

export default function OnboardingScreen() {
  const router = useRouter();
  const { isSignedIn, signOut } = useAuth();
  const { user } = useUser();

  if (isSignedIn) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <View className="flex-1 px-6 justify-center items-center">
          {/* Logo */}
          <View className="flex-row items-center gap-2 mb-6">
            <Image
              source={images.mascotLogo}
              className="w-12 h-12"
              resizeMode="contain"
            />
            <Text className="text-[32px] font-poppins-bold text-text-primary">
              muolingo
            </Text>
          </View>

          {/* Mascot Happy */}
          <Image
            source={images.mascotWelcome}
            className="w-56 h-56 mb-6"
            resizeMode="contain"
          />

          {/* User info */}
          <Text className="text-style--h2 mb-2 text-center">Welcome back!</Text>
          <Text className="text-style--body-md text-text-secondary mb-8 text-center">
            Signed in as:{"\n"}
            <Text className="font-poppins-semibold text-text-primary">
              {user?.emailAddresses[0]?.emailAddress || "User"}
            </Text>
          </Text>

          {/* Actions */}
          <View className="w-full gap-4">
            <Pressable
              onPress={() => Alert.alert("Coming Soon", "Lessons dashboard is currently under development.")}
              className="bg-lingua-purple rounded-2xl py-4 items-center"
              style={{
                shadowColor: "#6C4EF5",
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.25,
                shadowRadius: 10,
                elevation: 6,
              }}
            >
              <Text className="text-[18px] font-poppins-bold text-white">
                Go to Lessons
              </Text>
            </Pressable>

            <Pressable
              onPress={() => signOut()}
              className="border border-error rounded-2xl py-4 items-center"
            >
              <Text className="text-[18px] font-poppins-bold text-error">
                Sign Out
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

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
              router.push("/(auth)/sign-up");
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
