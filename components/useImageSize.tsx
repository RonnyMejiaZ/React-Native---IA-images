import { useEffect, useState } from "react";
import {
  Image,
  useWindowDimensions,
} from "react-native";
export function useImageSize(imageUri: string) {
  const [imageSize, setImageSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const screenWidth = useWindowDimensions().width;
  const targetWidth = screenWidth / 2 - 5;

  useEffect(() => {
    let isMounted = true;

    Image.getSize(
      imageUri,
      (width, height) => {
        if (!isMounted) {
          return;
        }
        const ratio = height / width;
        setImageSize({
          width: targetWidth,
          height: targetWidth * ratio,
        });
      },
      () => {
        if (!isMounted) {
          return;
        }
        setImageSize({
          width: targetWidth,
          height: targetWidth,
        });
      },
    );

    return () => {
      isMounted = false;
    };
  }, [imageUri, targetWidth]);

  return imageSize;
}

