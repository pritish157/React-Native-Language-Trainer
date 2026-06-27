import { useState } from "react";
import { View, Text, TextInput, Pressable, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { images } from "@/constants/images";
import VerificationModal from "@/components/VerificationModal";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [showVerification, setShowVerification] = useState(false);

  const handleSendCode = () => {
    // TODO: Integrate with Clerk forgot password
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
          <Text className="text-style--h1 mb-1">Forgot password?</Text>
          <Text className="text-style--body-md text-text-secondary">
            No worries, we'll send you a reset code ✨
          </Text>

          {/* ── Mascot ────────────────────────────────────── */}
          <View className="items-center mt-6 mb-6">
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

          {/* ── Send Code Button ──────────────────────────── */}
          <Pressable
            onPress={handleSendCode}
            className="bg-lingua-purple rounded-2xl py-4 items-center mb-6"
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
              Send Code
            </Text>
          </Pressable>

          {/* ── Back to Sign In Link ──────────────────────── */}
          <View className="flex-row justify-center">
            <Text className="text-style--body-md text-text-secondary">
              Remember your password?{" "}
            </Text>
            <Pressable onPress={() => router.back()}>
              <Text className="text-[14px] font-poppins-bold text-lingua-purple">
                Sign in
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
