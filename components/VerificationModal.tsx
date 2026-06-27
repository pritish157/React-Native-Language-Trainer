import { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";

interface VerificationModalProps {
  visible: boolean;
  onClose: () => void;
  email?: string;
}

const CODE_LENGTH = 6;

export default function VerificationModal({
  visible,
  onClose,
  email,
}: VerificationModalProps) {
  const router = useRouter();
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    // Only accept numeric input
    if (text && !/^\d$/.test(text)) return;

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < CODE_LENGTH - 1) {
      // Move focus to next input
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-navigate when last digit is entered
    if (text && index === CODE_LENGTH - 1) {
      const fullCode = newCode.join("");
      if (fullCode.length === CODE_LENGTH) {
        // Small delay so user sees the last digit fill in
        setTimeout(() => {
          setCode(Array(CODE_LENGTH).fill(""));
          onClose();
          router.replace("/");
        }, 300);
      }
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !code[index] && index > 0) {
      // Move focus to previous input on backspace when current is empty
      const newCode = [...code];
      newCode[index - 1] = "";
      setCode(newCode);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    // TODO: Integrate with Clerk resend verification
    setCode(Array(CODE_LENGTH).fill(""));
    inputRefs.current[0]?.focus();
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
            We've sent a verification code to{"\n"}
            {email ? (
              <Text className="font-poppins-semibold text-text-primary">
                {email}
              </Text>
            ) : (
              "your email"
            )}
          </Text>

          {/* Code inputs */}
          <View className="flex-row justify-center gap-3 mb-8">
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

          {/* Resend link */}
          <View className="flex-row justify-center">
            <Text className="text-style--body-md text-text-secondary">
              Didn't receive the code?{" "}
            </Text>
            <Pressable onPress={handleResend}>
              <Text className="text-[14px] font-poppins-semibold text-lingua-purple">
                Resend
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
