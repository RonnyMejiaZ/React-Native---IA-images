import { Link, Slot, Stack } from "expo-router";
import { GestureHandlerRootView, Pressable } from "react-native-gesture-handler";

import { styled } from "nativewind";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Logo } from "../components/Logo";
import { CircleInfoIcon } from "../components/icons";

const StyledPressable = styled(Pressable);


export default function layout() {
  return (
    <GestureHandlerRootView>
      <SafeAreaView className="flex-1 bg-black">
        <StatusBar style="light" />
        <Stack
          screenOptions={
            {
            headerStyle: {
              backgroundColor: "black",
              
            },
            headerTintColor: "yellow",
            headerTitle: "",
            headerLeft: () => <Logo />,
            headerRight: () => (
              <Link asChild href="/about">
                <StyledPressable className={`active:opacity-50 mx-4`}>
                  <CircleInfoIcon />
                </StyledPressable>
              </Link>
            ),
          }}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
