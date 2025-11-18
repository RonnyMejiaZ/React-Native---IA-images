import { Link, Slot, Stack, usePathname } from "expo-router";
import { GestureHandlerRootView, Pressable } from "react-native-gesture-handler";
import { View } from "react-native";

import { styled } from "nativewind";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Logo } from "../components/Logo";
import { CircleInfoIcon } from "../components/icons";
import { SearchBar } from "../components/SearchBar";
import { SearchProvider, useSearch } from "../contexts/SearchContext";

const StyledPressable = styled(Pressable);

function HeaderRight() {
  const { setSearchQuery } = useSearch();
  const pathname = usePathname();

  const isHomePage = pathname === "/" || pathname === "/(tabs)" || pathname?.startsWith("/(tabs)/");

  if (!isHomePage) {
    return (
      <Link asChild href="/">
        <StyledPressable className={`active:opacity-50 mx-4`}>
          <CircleInfoIcon />
        </StyledPressable>
      </Link>
    );
  }

  return (
    <View className="flex-row items-center">
      <SearchBar onSearch={setSearchQuery} placeholder="Buscar imágenes..." />
      <Link asChild href="/about">
        <StyledPressable className={`active:opacity-50 mx-2`}>
          <CircleInfoIcon />
        </StyledPressable>
      </Link>
    </View>
  );
}

export default function layout() {
  return (
    <SearchProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: "black",
            },
            headerTintColor: "yellow",
            headerTitle: "",
            headerLeft: () => <Logo />,
            headerRight: () => <HeaderRight />,
          }}
        />
      </GestureHandlerRootView>
    </SearchProvider>
  );
}
