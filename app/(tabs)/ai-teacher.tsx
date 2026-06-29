import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AiTeacherScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-[24px] font-poppins-bold text-text-primary mb-2">
          AI Teacher
        </Text>
        <Text className="text-[14px] font-poppins text-text-secondary text-center">
          AI-powered face-to-face video and audio learning lessons.
        </Text>
      </View>
    </SafeAreaView>
  );
}
