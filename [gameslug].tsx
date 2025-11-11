import { Stack, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";
import { Screen } from "../components/Screen";
import { useEffect, useState } from "react";

type Game = {
  description: string;
  slug: string;
  releaseDate: string;
  score: number;
  title: string;
  image: string;
};

export default function detail() {
  const { gameslug } = useLocalSearchParams();
  const [gameInfo, setGameInfo] = useState<Game | null>(null);

  useEffect(() => {
    fetch(`https://fakestoreapi.com/products/${gameslug}`)
      .then((res) => res.json())
      .then((data) =>
        setGameInfo({
          description: data.description,
          slug: data.id.toString(),
          releaseDate: "2024",
          score: data.rating.rate,
          title: data.title,
          image: data.image,
        })
      );
  }, [gameslug]);

  return (
    <Screen>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "#ffee00" },
          headerTintColor: "black",
          headerLeft: undefined,
          headerTitle: "",
          headerRight: undefined,
        }}
      />
      <View>
        {gameInfo === null ? (
          <ActivityIndicator color={"#fff"} />
        ) : (
          <ScrollView>
            <Text className="text-white text-2xl">
              Detalle del juego {gameInfo.title}
            </Text>
            <Image
              source={{ uri: gameInfo.image }}
              style={{
                width: 300,
                height: 300,
                borderRadius: 10,
                marginBottom: 16,
              }}
            />
            <Text className="text-white">{gameInfo.description}</Text>
          </ScrollView>
        )}
      </View>
    </Screen>
  );
}
