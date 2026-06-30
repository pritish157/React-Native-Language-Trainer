import "../global.css";

import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { ClerkProvider, useUser } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { ActivityIndicator, View, NativeModules } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in env variables.");
}

// Keep the splash screen visible until fonts are loaded
SplashScreen.preventAutoHideAsync();

let StreamVideo: any = ({ children }: any) => <>{children}</>;
let StreamVideoClient: any = null;

const hasWebRTC = !!NativeModules.WebRTCModule;
if (hasWebRTC) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const sdk = require("@stream-io/video-react-native-sdk");
    StreamVideo = sdk.StreamVideo;
    StreamVideoClient = sdk.StreamVideoClient;
  } catch (e) {
    console.warn("Failed to load Stream Video SDK dynamically:", e);
  }
}

function ConnectedVideo({ children }: { children: React.ReactNode }) {
  const { user, isSignedIn, isLoaded } = useUser();
  const [client, setClient] = useState<any>(null);

  useEffect(() => {
    if (!hasWebRTC) {
      return;
    }

    if (!isLoaded || !isSignedIn || !user) {
      setClient(null);
      return;
    }

    let active = true;
    let streamClient: any = null;

    const initStreamClient = async () => {
      try {
        const response = await fetch("/api/stream-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            userName: user.fullName || user.username || user.emailAddresses[0]?.emailAddress || user.id,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (!active) return;

        const tokenProvider = async () => {
          const res = await fetch("/api/stream-token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: user.id,
              userName: user.fullName || user.username || user.emailAddresses[0]?.emailAddress || user.id,
            }),
          });
          const d = await res.json();
          return d.token;
        };

        const sc = StreamVideoClient.getOrCreateInstance({
          apiKey: data.apiKey,
          user: {
            id: user.id,
            name: user.fullName || user.username || user.emailAddresses[0]?.emailAddress || user.id,
            image: user.imageUrl,
          },
          tokenProvider,
        });

        streamClient = sc;
        setClient(sc);
      } catch (err) {
        console.error("Failed to initialize Stream Video client:", err);
      }
    };

    initStreamClient();

    return () => {
      active = false;
      if (streamClient) {
        streamClient.disconnectUser().catch((err: any) => console.error("Error disconnecting user:", err));
      }
      setClient(null);
    };
  }, [isSignedIn, user, isLoaded]);

  if (hasWebRTC && isSignedIn && !client) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFFFFF" }}>
        <ActivityIndicator size="large" color="#6C4EF5" />
      </View>
    );
  }

  if (!client || !hasWebRTC) {
    return <>{children}</>;
  }

  return <StreamVideo client={client}>{children}</StreamVideo>;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "Poppins-Regular": require("../assets/assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../assets/assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../assets/assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("../assets/assets/fonts/Poppins-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <ConnectedVideo>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="language-select" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </ConnectedVideo>
      </ClerkProvider>
    </GestureHandlerRootView>
  );
}
