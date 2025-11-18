import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import { memo, useMemo } from "react";

import { styled } from "nativewind";
import { Link, type Href } from "expo-router";
import { useImageSize } from "./useImageSize";

const StyledPressable = styled(Pressable);

type AnimatedGameCardProps = {
  imageUri: string;
  index: number;
  slug: string;
  style?: StyleProp<ViewStyle>;
};

function PromptCardComponent({ imageUri, slug }: AnimatedGameCardProps) {
  const imageSize = useImageSize(imageUri);
  const imageHref = useMemo(
    () =>
      ({
        pathname: "/[imageslug]",
        params: {
          imageslug: slug,
        },
      } as const as unknown as Href),
    [slug]
  );

  if (!imageSize) {
    return (
      <View
        style={{
          width: 200,
          height: 200,
          backgroundColor: "#1a1a1a",
          borderRadius: 12,
          marginBottom: 8,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator color="#fff" size="small" />
      </View>
    );
  }

  return (
    <Link href={imageHref} asChild>
      <StyledPressable
        className="active:opacity-70"
        style={{
          width: imageSize.width,
          height: imageSize.height,
          marginBottom: 8,
          alignSelf: "center",
        }}
      >
        <Image
          source={{ uri: imageUri }}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 12,
          }}
          resizeMode="cover"
        />
      </StyledPressable>
    </Link>
  );
}

export const PromptCard = memo(PromptCardComponent);

// export function AnimatedGameCard({ game, index }: AnimatedGameCardProps) {
//   const opacity = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.timing(opacity, {
//       toValue: 1,
//       duration: 500,
//       delay: index * 200,
//       useNativeDriver: true,
//     }).start();
//   }, [opacity, index]);

//   return (
//     <Animated.View style={{ opacity }}>
//       <ImageCard game={game} />
//     </Animated.View>
//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     margin: 10,
//   },
//   image: {
//     width: 107,
//     height: 147,
//     borderRadius: 10,
//   },
//   title: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#fff",
//   },
//   description: {
//     fontSize: 12,
//     color: "#fff",
//   },
// });
