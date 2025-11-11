import MasonryList from "@react-native-seoul/masonry-list";
import { ReactElement, useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  View,
} from "react-native";
import { getLatestPrompts } from "@/lib/metacritic";
import { PromptCard } from "./PromptCard";

export type Prompt = {
  slug: string;
  image: string;
};

export function Main() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRequestPending, setIsRequestPending] = useState(false);

  const loadPrompts = useCallback(async (options: { reset?: boolean } = {}) => {
    if (isRequestPending) {
      return;
    }

    const { reset = false } = options;
    const nextPage = reset ? 1 : page;

    setIsRequestPending(true);
    if (reset) {
      setIsRefreshing(true);
    } else if (nextPage === 1 && prompts.length === 0) {
      setIsInitialLoading(true);
    } else {
      setIsFetchingMore(true);
    }

    try {
      const fetchedPrompts = await getLatestPrompts(nextPage, 10);
      setPrompts((previous) => {
        const base = reset ? [] : previous;
        const knownSlugs = new Set(base.map((prompt) => prompt.slug));
        const unique = fetchedPrompts.filter((prompt) => !knownSlugs.has(prompt.slug));
        return reset ? unique : [...base, ...unique];
      });
      setPage(nextPage + 1);
    } finally {
      setIsRequestPending(false);
      setIsInitialLoading(false);
      setIsRefreshing(false);
      setIsFetchingMore(false);
    }
  }, [isRequestPending, page, prompts.length]);

  useEffect(() => {
    void loadPrompts();
  }, [loadPrompts]);

  const renderItem = ({
    item,
    i,
  }: {
    item: unknown;
    i: number;
  }): ReactElement => {
    const prompt = item as Prompt;
    return (
      <PromptCard
        key={prompt.slug}
        imageUri={prompt.image}
        slug={prompt.slug}
        index={i}
      />
    );
  };

  if (prompts.length === 0 && isInitialLoading) {
    return (
      <View
        style={{ flex: 1, backgroundColor: "black", justifyContent: "center" }}
      >
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <MasonryList
        data={prompts}
        keyExtractor={(item: Prompt): string => item.slug}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignSelf: "stretch",
        }}
        numColumns={2}
        renderItem={renderItem}
        refreshing={isRefreshing}
        onRefresh={() => {
          void loadPrompts({ reset: true });
        }}
        onEndReached={() => {
          if (!isRequestPending) {
            void loadPrompts();
          }
        }}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          isFetchingMore ? (
            <View className="py-6">
              <ActivityIndicator color="#fff" />
            </View>
          ) : null
        }
      />
    </View>
  );
}

