import { useEffect, useMemo, useState } from "react";
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
  
  const targetWidth = useMemo(() => {
    const paddingHorizontal = 8;
    const columnSpacing = 2;
    const numColumns = 2;
    const baseWidth = (screenWidth - paddingHorizontal - (columnSpacing * (numColumns - 1))) / numColumns;
    return baseWidth;
  }, [screenWidth]);

  useEffect(() => {
    if (!imageUri) return;
    
    let isMounted = true;
    let cancelled = false;

    Image.getSize(
      imageUri,
      (width, height) => {
        if (!isMounted || cancelled) {
          return;
        }
        const ratio = height / width;
        setImageSize({
          width: targetWidth,
          height: targetWidth * ratio,
        });
      },
      () => {
        if (!isMounted || cancelled) {
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
      cancelled = true;
    };
  }, [imageUri, targetWidth]);

  return imageSize;
}

