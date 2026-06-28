import { useState } from "react";
import { View, Text, TextInput, Pressable, Image, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons, FontAwesome, AntDesign } from "@expo/vector-icons";
import { images } from "@/constants/images";
import { useSignUp } from "@clerk/expo/legacy";
import { useSSO } from "@clerk/expo";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import VerificationModal from "@/components/VerificationModal";

WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
  const router = useRouter();
  const { isLoaded, signUp } = useSignUp();
  const { startSSOFlow } = useSSO();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      const { createdSessionId, setActive: setOAuthActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl: Linking.createURL("/oauth-callback", { scheme: "myapp" }),
      });

      if (createdSessionId && setOAuthActive) {
        await setOAuthActive({ session: createdSessionId });
        router.replace("/");
      }
    } catch (err: any) {
      Alert.alert("Google Sign-In Error", err.message || "Failed to sign up with Google.");
    }
  };

  const handleSignUp = async () => {
    if (!isLoaded) return;
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      await signUp.create({
        emailAddress: email,
        password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setShowVerification(true);
    } catch (err: any) {
      Alert.alert("Sign Up Error", err.errors?.[0]?.message || err.message || "Failed to sign up.");
    } finally {
      setLoading(false);
    }
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
          <Text className="text-style--h1 mb-1">Create your account</Text>
          <Text className="text-style--body-md text-text-secondary">
            Start your language journey today ✨
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
          <View className="auth-input mb-3">
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

          {/* ── Password Input ────────────────────────────── */}
          <View className="auth-input mb-6">
            <Text className="text-style--caption text-text-secondary mb-1">
              Password
            </Text>
            <View className="flex-row items-center">
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                style={{
                  flex: 1,
                  fontSize: 16,
                  fontFamily: "Poppins-Regular",
                  color: "#0D132B",
                  padding: 0,
                }}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="#9CA3AF"
                />
              </Pressable>
            </View>
          </View>

          {/* ── Sign Up Button ────────────────────────────── */}
          <Pressable
            onPress={handleSignUp}
            disabled={loading}
            className="bg-lingua-purple rounded-2xl py-4 items-center mb-6"
            style={({ pressed }) => ({
              opacity: (pressed || loading) ? 0.7 : 1,
              shadowColor: "#6C4EF5",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.35,
              shadowRadius: 12,
              elevation: 8,
            })}
          >
            <Text className="text-[18px] font-poppins-bold text-white">
              {loading ? "Signing Up..." : "Sign Up"}
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
              onPress={handleGoogleSignIn}
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
          </View>

          {/* ── Footer Link ───────────────────────────────── */}
          <View className="flex-row justify-center pb-4">
            <Text className="text-style--body-md text-text-secondary">
              Already have an account?{" "}
            </Text>
            <Pressable onPress={() => router.replace("/(auth)/sign-in")}>
              <Text className="text-[14px] font-poppins-bold text-lingua-purple">
                Log in
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
        flow="sign-up"
      />
    </SafeAreaView>
  );
}
