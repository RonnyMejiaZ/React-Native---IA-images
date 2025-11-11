import { getLatestGames } from "@/lib/metacritic";
import { useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ActivityIndicator, Pressable, View } from "react-native";
import { AnimatedGameCard } from "./GameCard";

// const StyledPressable = styled(Pressable);

export function Main() {
  const [games, setGames] = useState([]);
  // const insets = useSafeAreaInsets();

  useEffect(() => {
    getLatestGames().then((games) => {
      setGames(games);
    });
  }, []);

  return (
    <View className="bg-black">
      {/* <View>
        <Logo />
      </View> */}
      {/* <Link asChild href="/about">
        <Pressable>
        {({ pressed }) => (
          <CircleInfoIcon style={{ opacity: pressed ? 0.5 : 1 }} />
        )}
        </Pressable>

        <StyledPressable className={`active:opacity-50 mb-4`}>
          <CircleInfoIcon />
        </StyledPressable>
      </Link> */}

      {games.length === 0 ? (
        <ActivityIndicator color={"#fff"} />
      ) : (
        <FlatList
          data={games}
          keyExtractor={(game) => game.slug}
          renderItem={({ item, index }) => (
            <AnimatedGameCard game={item} index={index} />
          )}
        />
      )}
    </View>
  );
}
