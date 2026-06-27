import { useState } from "react";
import { View, Text, TextInput, Pressable, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons, FontAwesome, AntDesign } from "@expo/vector-icons";
import { images } from "@/constants/images";
import VerificationModal from "@/components/VerificationModal";

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [showVerification, setShowVerification] = useState(false);

  const handleSignIn = () => {
    // TODO: Integrate with Clerk sign-in
    setShowVerification(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-6">
          {/* ── Back Button ───────────────────────────────── */}
          <Pressable
            onPress={() => router.back()}
            className="mt-2 mb-4 w-10 h-10 items-center justify-center"
          >
            <Ionicons name="chevron-back" size={24} color="#0D132B" />
          </Pressable>

          {/* ── Header ────────────────────────────────────── */}
          <Text className="text-style--h1 mb-1">Welcome back</Text>
          <Text className="text-style--body-md text-text-secondary">
            Continue your language journey ✨
          </Text>

          {/* ── Mascot ────────────────────────────────────── */}
          <View className="items-center mt-4 mb-4">
            <Image
              source={images.mascotAuth}
              className="w-44 h-44"
              resizeMode="contain"
            />
          </View>

          {/* ── Email Input ───────────────────────────────── */}
          <View className="auth-input mb-6">
            <Text className="text-style--caption text-text-secondary mb-1">
              Email
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="alex@gmail.com"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={{
                fontSize: 16,
                fontFamily: "Poppins-Regular",
                color: "#0D132B",
                padding: 0,
              }}
            />
          </View>

          {/* ── Sign In Button ────────────────────────────── */}
          <Pressable
            onPress={handleSignIn}
            className="bg-lingua-purple rounded-2xl py-4 items-center mb-4"
            style={({ pressed }) => ({
              opacity: pressed ? 0.9 : 1,
              shadowColor: "#6C4EF5",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.35,
              shadowRadius: 12,
              elevation: 8,
            })}
          >
            <Text className="text-[18px] font-poppins-bold text-white">
              Sign In
            </Text>
          </Pressable>

          {/* ── Forgot Password ───────────────────────────── */}
          <Pressable
            onPress={() => router.push("/(auth)/forgot-password")}
            className="items-center mb-6"
          >
            <Text className="text-[14px] font-poppins-semibold text-lingua-purple">
              Forgot password?
            </Text>
          </Pressable>

          {/* ── Divider ───────────────────────────────────── */}
          <View className="auth-divider mb-5">
            <View className="auth-divider-line" />
            <Text className="text-style--body-sm text-text-secondary">
              or continue with
            </Text>
            <View className="auth-divider-line" />
          </View>

          {/* ── Social Buttons ────────────────────────────── */}
          <View className="gap-3 mb-8">
            <Pressable
              className="auth-social-btn"
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <AntDesign
                name="google"
                size={20}
                color="#4285F4"
                style={{ marginRight: 12 }}
              />
              <Text className="text-style--h4">Continue with Google</Text>
            </Pressable>

            <Pressable
              className="auth-social-btn"
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <FontAwesome
                name="facebook"
                size={22}
                color="#1877F2"
                style={{ marginRight: 12 }}
              />
              <Text className="text-style--h4">Continue with Facebook</Text>
            </Pressable>

            <Pressable
              className="auth-social-btn"
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <AntDesign
                name="apple"
                size={22}
                color="#000000"
                style={{ marginRight: 12 }}
              />
              <Text className="text-style--h4">Continue with Apple</Text>
            </Pressable>
          </View>

          {/* ── Footer Link ───────────────────────────────── */}
          <View className="flex-row justify-center pb-4">
            <Text className="text-style--body-md text-text-secondary">
              Don't have an account?{" "}
            </Text>
            <Pressable onPress={() => router.replace("/(auth)/sign-up")}>
              <Text className="text-[14px] font-poppins-bold text-lingua-purple">
                Sign up
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* ── Verification Modal ────────────────────────── */}
      <VerificationModal
        visible={showVerification}
        onClose={() => setShowVerification(false)}
        email={email}
      />
    </SafeAreaView>
  );
}
