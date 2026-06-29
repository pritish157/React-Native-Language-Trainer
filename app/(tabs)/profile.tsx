import React from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth, useUser } from "@clerk/expo";

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-[24px] font-poppins-bold text-text-primary mb-2">
          Profile
        </Text>
        <Text className="text-[14px] font-poppins text-text-secondary text-center mb-8">
          Logged in as: {user?.emailAddresses[0]?.emailAddress || "Guest"}
        </Text>

        <Pressable
          onPress={() => signOut()}
          className="w-full bg-[#FF4D4F]/10 border border-[#FF4D4F]/20 rounded-2xl py-4 items-center active:bg-[#FF4D4F]/20"
        >
          <Text className="text-[16px] font-poppins-bold text-error">
            Sign Out
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
