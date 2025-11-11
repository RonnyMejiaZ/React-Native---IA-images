import {
  Image,
  Pressable,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";

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

export function PromptCard({ imageUri, slug }: AnimatedGameCardProps) {
  const imageSize = useImageSize(imageUri);
  const imageHref = {
    pathname: "/[imageslug]",
    params: {
      imageslug: slug,
    },
  } as const as unknown as Href;

  if (!imageSize) return null; // o spinner de carga
  return (
    <Link href={imageHref} asChild>
      <StyledPressable
        className={`active:opacity-70 rounded-xl mb-5 `}
      >
        <View className="gap-2">
          <Image
            source={{ uri: imageUri }}
            key={imageUri}
            style={{
              width: imageSize.width,
              height: imageSize.height,
              borderRadius: 10,
            }}
            resizeMode="cover"
          />
        </View>
      </StyledPressable>
    </Link>
  );
}

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
