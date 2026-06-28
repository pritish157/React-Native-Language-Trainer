import { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useSignUp, useSignIn } from "@clerk/expo/legacy";
import { Ionicons } from "@expo/vector-icons";

interface VerificationModalProps {
  visible: boolean;
  onClose: () => void;
  email: string;
  flow: "sign-up" | "reset-password";
}

const CODE_LENGTH = 6;

export default function VerificationModal({
  visible,
  onClose,
  email,
  flow,
}: VerificationModalProps) {
  const router = useRouter();
  const { signUp, isLoaded: isSignUpLoaded, setActive: setSignUpActive } = useSignUp();
  const { signIn, isLoaded: isSignInLoaded, setActive: setSignInActive } = useSignIn();

  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleVerification = async (verificationCode: string) => {
    setLoading(true);
    try {
      if (flow === "sign-up") {
        if (!isSignUpLoaded || !signUp) return;
        const completeSignUp = await signUp.attemptEmailAddressVerification({
          code: verificationCode,
        });
        if (completeSignUp.status === "complete") {
          await setSignUpActive({ session: completeSignUp.createdSessionId });
          setCode(Array(CODE_LENGTH).fill(""));
          onClose();
          router.replace("/");
        } else {
          Alert.alert("Verification Incomplete", "Sign up is incomplete. Please try again.");
        }
      } else if (flow === "reset-password") {
        if (!isSignInLoaded || !signIn) return;
        if (!newPassword) {
          Alert.alert("Error", "Please enter your new password.");
          setLoading(false);
          return;
        }

        const completeReset = await signIn.attemptFirstFactor({
          strategy: "reset_password_email_code",
          code: verificationCode,
          password: newPassword,
        });

        if (completeReset.status === "complete") {
          await setSignInActive({ session: completeReset.createdSessionId });
          setCode(Array(CODE_LENGTH).fill(""));
          setNewPassword("");
          onClose();
          router.replace("/");
        } else {
          Alert.alert("Reset Incomplete", "Password reset is incomplete. Please try again.");
        }
      }
    } catch (err: any) {
      Alert.alert("Verification Error", err.errors?.[0]?.message || err.message || "Invalid code.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (text: string, index: number) => {
    if (text && !/^\d$/.test(text)) return;

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-navigate/submit for Sign Up when the last digit is entered
    if (text && index === CODE_LENGTH - 1 && flow === "sign-up") {
      const fullCode = newCode.join("");
      if (fullCode.length === CODE_LENGTH) {
        setTimeout(() => {
          handleVerification(fullCode);
        }, 300);
      }
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !code[index] && index > 0) {
      const newCode = [...code];
      newCode[index - 1] = "";
      setCode(newCode);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      if (flow === "sign-up") {
        if (!isSignUpLoaded || !signUp) return;
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        Alert.alert("Success", "Verification code resent.");
      } else if (flow === "reset-password") {
        if (!isSignInLoaded || !signIn) return;
        await signIn.create({
          strategy: "reset_password_email_code",
          identifier: email,
        });
        Alert.alert("Success", "Reset code resent.");
      }
      setCode(Array(CODE_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      Alert.alert("Error", err.errors?.[0]?.message || err.message || "Failed to resend code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = () => {
    const fullCode = code.join("");
    if (fullCode.length !== CODE_LENGTH) {
      Alert.alert("Error", "Please enter the full 6-digit code.");
      return;
    }
    handleVerification(fullCode);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, justifyContent: "flex-end" }}
      >
        {/* Backdrop */}
        <Pressable
          onPress={onClose}
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }}
        />

        {/* Modal Content */}
        <View className="bg-white rounded-t-3xl px-6 pt-8 pb-12">
          {/* Handle bar */}
          <View className="w-10 h-1 bg-border rounded-full self-center mb-6" />

          {/* Mail icon */}
          <View className="w-16 h-16 rounded-full bg-surface items-center justify-center self-center mb-5">
            <Text className="text-[28px]">✉️</Text>
          </View>

          {/* Title */}
          <Text className="text-style--h2 text-center mb-2">
            Check your email
          </Text>

          {/* Subtitle */}
          <Text className="text-style--body-md text-text-secondary text-center mb-8">
            {"We've sent a verification code to\n"}
            {email ? (
              <Text className="font-poppins-semibold text-text-primary">
                {email}
              </Text>
            ) : (
              "your email"
            )}
          </Text>

          {/* Code inputs */}
          <View className="flex-row justify-center gap-3 mb-6">
            {Array.from({ length: CODE_LENGTH }).map((_, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                value={code[index]}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={({ nativeEvent }) =>
                  handleKeyPress(nativeEvent.key, index)
                }
                keyboardType="number-pad"
                maxLength={1}
                autoFocus={index === 0}
                style={{
                  width: 48,
                  height: 56,
                  borderWidth: code[index] ? 2 : 1,
                  borderColor: code[index] ? "#6C4EF5" : "#E5E7EB",
                  borderRadius: 14,
                  textAlign: "center",
                  fontSize: 22,
                  fontFamily: "Poppins-SemiBold",
                  color: "#0D132B",
                  backgroundColor: code[index] ? "#F5F3FF" : "#FFFFFF",
                }}
              />
            ))}
          </View>

          {/* New Password Input (Only for password reset flow) */}
          {flow === "reset-password" && (
            <View className="auth-input mb-6">
              <Text className="text-style--caption text-text-secondary mb-1">
                New Password
              </Text>
              <View className="flex-row items-center">
                <TextInput
                  value={newPassword}
                  onChangeText={setNewPassword}
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
          )}

          {/* Action button */}
          {flow === "reset-password" && (
            <Pressable
              onPress={handleResetSubmit}
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
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text className="text-[18px] font-poppins-bold text-white">
                  Reset Password & Sign In
                </Text>
              )}
            </Pressable>
          )}

          {/* Resend link */}
          <View className="flex-row justify-center mt-2">
            <Text className="text-style--body-md text-text-secondary">
              {"Didn't receive the code? "}
            </Text>
            <Pressable onPress={handleResend} disabled={loading}>
              <Text className="text-[14px] font-poppins-semibold text-lingua-purple">
                {loading ? "Sending..." : "Resend"}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
