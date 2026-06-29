import React, { useState, useEffect } from "react";
import { View, Pressable } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

// Map routes to display labels
const getTabLabel = (routeName: string) => {
  switch (routeName) {
    case "index":
      return "Home";
    case "learn":
      return "Learn";
    case "ai-teacher":
      return "AI Teacher";
    case "chat":
      return "Chat";
    case "profile":
      return "Profile";
    default:
      return routeName;
  }
};

// Map routes to active/inactive icons
const getTabIcon = (routeName: string, isActive: boolean) => {
  switch (routeName) {
    case "index":
      return isActive ? "home" : "home-outline";
    case "learn":
      return isActive ? "book" : "book-outline";
    case "ai-teacher":
      return isActive ? "headset" : "headset-outline";
    case "chat":
      return isActive ? "chatbubble" : "chatbubble-outline";
    case "profile":
      return isActive ? "person" : "person-outline";
    default:
      return "help-circle-outline";
  }
};

interface TabButtonProps {
  isActive: boolean;
  onPress: () => void;
  onLongPress: () => void;
  iconName: string;
  label: string;
}

const TabButton = ({ isActive, onPress, onLongPress, iconName, label }: TabButtonProps) => {
  const iconTranslateY = useSharedValue(isActive ? 0 : -6);
  const labelOpacity = useSharedValue(isActive ? 0 : 1);
  const labelTranslateY = useSharedValue(isActive ? 10 : 0);

  useEffect(() => {
    iconTranslateY.value = withSpring(isActive ? 0 : -6, {
      damping: 15,
      stiffness: 150,
    });
    labelOpacity.value = withTiming(isActive ? 0 : 1, {
      duration: 150,
    });
    labelTranslateY.value = withSpring(isActive ? 10 : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [isActive, iconTranslateY, labelOpacity, labelTranslateY]);

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: iconTranslateY.value }],
    };
  });

  const animatedLabelStyle = useAnimatedStyle(() => {
    return {
      opacity: labelOpacity.value,
      transform: [{ translateY: labelTranslateY.value }],
    };
  });

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      className="flex-1 items-center justify-center h-[70px]"
    >
      <Animated.View style={animatedIconStyle} className="items-center justify-center z-10 w-12 h-12">
        <Ionicons
          name={iconName as any}
          size={24}
          color={isActive ? "#FFFFFF" : "#6B7280"}
        />
      </Animated.View>
      
      <Animated.Text
        style={animatedLabelStyle}
        className="absolute bottom-2.5 text-[11px] font-poppins-medium text-[#6B7280]"
      >
        {label}
      </Animated.Text>
    </Pressable>
  );
};

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const [containerWidth, setContainerWidth] = useState(0);
  const activeIndex = state.index;
  const circleSize = 52;
  const innerHeight = 70;

  // Shared value for sliding active indicator
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (containerWidth > 0) {
      const tabWidth = containerWidth / state.routes.length;
      const targetX = activeIndex * tabWidth + (tabWidth - circleSize) / 2;
      translateX.value = withSpring(targetX, {
        damping: 18,
        stiffness: 130,
      });
    }
  }, [activeIndex, containerWidth, state.routes.length, translateX, circleSize]);

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
      className="flex-row bg-white border-t border-[#E5E7EB] w-full"
      style={{
        paddingBottom: insets.bottom > 0 ? insets.bottom : 12,
        height: innerHeight + (insets.bottom > 0 ? insets.bottom : 12),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 8,
      }}
    >
      {/* Active circular indicator */}
      {containerWidth > 0 && (
        <Animated.View
          style={[
            animatedIndicatorStyle,
            {
              width: circleSize,
              height: circleSize,
              borderRadius: circleSize / 2,
              top: (innerHeight - circleSize) / 2,
            },
          ]}
          className="absolute bg-lingua-purple shadow-md shadow-lingua-purple/35"
        />
      )}

      {/* Render tab buttons */}
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        const label = getTabLabel(route.name);
        const iconName = getTabIcon(route.name, isFocused);

        return (
          <TabButton
            key={route.key}
            isActive={isFocused}
            onPress={onPress}
            onLongPress={onLongPress}
            iconName={iconName}
            label={label}
          />
        );
      })}
    </View>
  );
}
