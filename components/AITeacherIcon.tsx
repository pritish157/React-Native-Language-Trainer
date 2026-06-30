import React from "react";
import { View } from "react-native";

interface AITeacherIconProps {
  color: string;
  size?: number;
}

export function AITeacherIcon({ color, size = 24 }: AITeacherIconProps) {
  // Scale factor based on standard size 24
  const scale = size / 24;

  return (
    <View 
      style={{
        width: size,
        height: size,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Headband */}
      <View
        style={{
          position: "absolute",
          top: 1 * scale,
          width: 17 * scale,
          height: 10 * scale,
          borderTopWidth: 2 * scale,
          borderLeftWidth: 2 * scale,
          borderRightWidth: 2 * scale,
          borderColor: color,
          borderTopLeftRadius: 10 * scale,
          borderTopRightRadius: 10 * scale,
          backgroundColor: "transparent",
        }}
      />

      {/* Head / Face */}
      <View
        style={{
          width: 18 * scale,
          height: 18 * scale,
          borderRadius: 9 * scale,
          borderWidth: 2 * scale,
          borderColor: color,
          backgroundColor: "transparent",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 2 * scale,
          position: "relative",
        }}
      >
        {/* Eyes Container */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: 8 * scale,
            marginBottom: 2 * scale,
          }}
        >
          {/* Left Eye */}
          <View
            style={{
              width: 2.5 * scale,
              height: 2.5 * scale,
              borderRadius: 1.25 * scale,
              backgroundColor: color,
            }}
          />
          {/* Right Eye */}
          <View
            style={{
              width: 2.5 * scale,
              height: 2.5 * scale,
              borderRadius: 1.25 * scale,
              backgroundColor: color,
            }}
          />
        </View>

        {/* Smile */}
        <View
          style={{
            width: 4 * scale,
            height: 2 * scale,
            borderBottomWidth: 1.5 * scale,
            borderColor: color,
            borderBottomLeftRadius: 2 * scale,
            borderBottomRightRadius: 2 * scale,
            backgroundColor: "transparent",
          }}
        />
      </View>

      {/* Left Earcup */}
      <View
        style={{
          position: "absolute",
          left: 1 * scale,
          top: 9 * scale,
          width: 3 * scale,
          height: 7 * scale,
          borderRadius: 1.5 * scale,
          backgroundColor: color,
        }}
      />

      {/* Right Earcup */}
      <View
        style={{
          position: "absolute",
          right: 1 * scale,
          top: 9 * scale,
          width: 3 * scale,
          height: 7 * scale,
          borderRadius: 1.5 * scale,
          backgroundColor: color,
        }}
      />
    </View>
  );
}
