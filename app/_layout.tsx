import {
  Stack,
  useRouter,
  useSegments,
} from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from "react-native";

import { COLORS } from "@/constants/colors";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export default function RootLayout() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const [startupComplete, setStartupComplete] = useState(false);

  useEffect(() => {
    const resetSessionOnStartup = async () => {
      await supabase.auth.signOut();
      setStartupComplete(true);
    };

    resetSessionOnStartup();
  }, []);

  useEffect(() => {
    if (loading || !startupComplete) {
      return;
    }

    const currentRoute = segments[0];

    const inAuthGroup =
      currentRoute === "login" ||
      currentRoute === "register";

    if (!user && !inAuthGroup) {
      router.replace("/login");
      return;
    }

    if (user && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [
    user,
    loading,
    startupComplete,
    segments,
    router,
  ]);

  if (loading || !startupComplete) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
        />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="register"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },
});