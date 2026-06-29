import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  Image,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { languages } from "@/data/languages";
import { images } from "@/constants/images";

export default function LanguageSelectScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Default selection is Spanish ("es") as shown in the mockup
  const [selectedLanguageId, setSelectedLanguageId] = useState<string>("es");

  // Dynamic search filtering
  const filteredLanguages = languages.filter((lang) =>
    lang.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  // Trigger haptic feedback and select language
  const handleSelectLanguage = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedLanguageId(id);
  };

  // Action when Confirm is pressed
  const handleConfirm = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // For this step, simply navigate back. 
    // In the next step, we will store this in Zustand/AsyncStorage.
    router.back();
  };

  return (
    <View className="flex-1 bg-white">
      {/* Scrollable Container with sticky footer style layout */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "space-between",
          paddingBottom: insets.bottom > 0 ? insets.bottom : 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Section: Header, Search and Languages */}
        <View>
          {/* Custom Header */}
          <View
            style={{ paddingTop: insets.top + 12 }}
            className="px-6 pb-4 flex-row items-center justify-between"
          >
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.back();
              }}
              className="p-2 -ml-2 active:opacity-70"
            >
              <Ionicons name="chevron-back" size={26} color="#0D132B" />
            </Pressable>

            <Text className="text-[20px] font-poppins-bold text-text-primary text-center flex-1 pr-6">
              Choose a language
            </Text>
          </View>

          {/* Search Bar */}
          <View className="px-6 mb-6">
            <View className="flex-row items-center bg-[#F6F7FB] border border-[#E5E7EB] rounded-2xl px-4 py-3">
              <Ionicons name="search" size={20} color="#6B7280" className="mr-3" />
              <TextInput
                placeholder="Search languages"
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="flex-1 text-[16px] font-poppins text-text-primary p-0"
                style={{ textAlignVertical: "center" }}
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <Pressable
                  onPress={() => setSearchQuery("")}
                  className="p-1"
                >
                  <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                </Pressable>
              )}
            </View>
          </View>

          {/* Popular Section */}
          <Text className="text-[18px] font-poppins-bold text-text-primary px-6 mb-4">
            Popular
          </Text>

          {/* Languages Cards */}
          <View className="px-6 gap-3">
            {filteredLanguages.map((lang) => {
              const isSelected = lang.id === selectedLanguageId;
              return (
                <Pressable
                  key={lang.id}
                  onPress={() => handleSelectLanguage(lang.id)}
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.95 : 1,
                    shadowColor: isSelected ? "#6C4EF5" : "#000000",
                    shadowOffset: { width: 0, height: isSelected ? 4 : 1 },
                    shadowOpacity: isSelected ? 0.15 : 0.03,
                    shadowRadius: isSelected ? 8 : 4,
                    elevation: isSelected ? 4 : 1,
                    borderWidth: isSelected ? 2 : 1,
                    borderColor: isSelected ? "#6C4EF5" : "#E5E7EB",
                    backgroundColor: "#FFFFFF",
                  })}
                  className="flex-row items-center justify-between rounded-2xl px-4 py-3.5"
                >
                  {/* Flag and Info Container */}
                  <View className="flex-row items-center flex-1">
                    {/* Circle Flag Wrapper */}
                    <View className="w-12 h-12 rounded-full bg-[#F6F7FB] border border-[#E5E7EB] items-center justify-center mr-4">
                      <Text className="text-[26px]" style={{ lineHeight: 32 }}>
                        {lang.flag}
                      </Text>
                    </View>

                    {/* Language details */}
                    <View className="flex-1 pr-4">
                      <Text className="text-[17px] font-poppins-bold text-text-primary">
                        {lang.name}
                      </Text>
                      {lang.learnersCount && (
                        <Text className="text-[13px] font-poppins text-text-secondary mt-0.5">
                          {lang.learnersCount}
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* Selection Mark or Arrow */}
                  <View>
                    {isSelected ? (
                      <Ionicons name="checkmark-circle" size={28} color="#6C4EF5" />
                    ) : (
                      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    )}
                  </View>
                </Pressable>
              );
            })}

            {filteredLanguages.length === 0 && (
              <View className="items-center justify-center py-8">
                <Text className="text-[16px] font-poppins text-text-secondary">
                  No languages found matching &quot;{searchQuery}&quot;
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Bottom Section: Confirm Button and Earth Graphics */}
        <View className="mt-8">
          {/* Confirmation Button */}
          <View className="px-6 mb-6">
            <Pressable
              onPress={handleConfirm}
              style={({ pressed }) => ({
                opacity: pressed ? 0.9 : 1,
                shadowColor: "#6C4EF5",
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
                elevation: 6,
              })}
              className="bg-lingua-purple rounded-2xl py-4.5 items-center justify-center"
            >
              <Text className="text-[18px] font-poppins-bold text-white">
                Confirm
              </Text>
            </Pressable>
          </View>

          {/* Earth Illustration Footer */}
          <View className="w-full relative overflow-hidden" style={{ height: 160 }}>
            <Image
              source={images.earth}
              style={{
                width: width,
                height: 160,
                position: "absolute",
                bottom: 0,
              }}
              resizeMode="cover"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
