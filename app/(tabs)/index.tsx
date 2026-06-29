import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-[24px] font-poppins-bold text-text-primary mb-2">
          Home Screen
        </Text>
        <Text className="text-[14px] font-poppins text-text-secondary text-center">
          The main learning dashboard will be implemented here.
        </Text>
      </View>
    </SafeAreaView>
  );
}
