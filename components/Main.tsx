import MasonryList from "@react-native-seoul/masonry-list";
import { ReactElement, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  View,
} from "react-native";
import { generatePrompts } from "@/lib/lexica";
import { PromptCard } from "./PromptCard";
import { useSearch } from "@/contexts/SearchContext";

export type Prompt = {
  slug: string;
  image: string;
  promptText?: string;
};

export function Main() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [allPrompts, setAllPrompts] = useState<Prompt[]>([]);
  const { searchQuery } = useSearch();
  
  console.log("Main - searchQuery actual:", searchQuery);
  console.log("Main - allPrompts.length:", allPrompts.length);
  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRequestPending, setIsRequestPending] = useState(false);
  const hasLoadedInitial = useRef(false);

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
      const fixedPrompt = "a trending wallpaper";
      const fetchedPrompts = await generatePrompts(fixedPrompt, nextPage, 10);
      setAllPrompts((previous) => {
        const base = reset ? [] : previous;
        const knownSlugs = new Set(base.map((prompt) => prompt.slug));
        const unique = fetchedPrompts.filter((prompt) => !knownSlugs.has(prompt.slug));
        const result = reset ? unique : [...base, ...unique];
        console.log("Prompts actualizados. Total:", result.length);
        if (result.length > 0) {
          console.log("Primer prompt tiene promptText:", !!result[0].promptText, result[0].promptText?.substring(0, 50));
        }
        return result;
      });
      setPage((prevPage) => (reset ? 2 : prevPage + 1));
    } finally {
      setIsRequestPending(false);
      setIsInitialLoading(false);
      setIsRefreshing(false);
      setIsFetchingMore(false);
    }
  }, [isRequestPending, page]);

  useEffect(() => {
    if (!hasLoadedInitial.current) {
      hasLoadedInitial.current = true;
      void loadPrompts();
    }
  }, [loadPrompts]);

  const filteredPrompts = useMemo(() => {
    console.log("Filtrando prompts. Query:", searchQuery, "Total prompts:", allPrompts.length);
    
    if (allPrompts.length > 0) {
      console.log("Ejemplo de primeros 3 prompts:", allPrompts.slice(0, 3).map(p => ({
        slug: p.slug,
        hasPromptText: !!p.promptText,
        promptTextLength: p.promptText?.length || 0,
        promptTextPreview: p.promptText?.substring(0, 50) || "vacío"
      })));
    }
    
    if (!searchQuery.trim()) {
      return allPrompts;
    }
    const query = searchQuery.toLowerCase();
    const filtered = allPrompts.filter((prompt) => {
      const promptText = (prompt.promptText || "").toLowerCase();
      const matches = promptText.includes(query);
      if (matches) {
        console.log("Match encontrado:", promptText.substring(0, 100));
      }
      return matches;
    });
    console.log("Resultados filtrados:", filtered.length, "de", allPrompts.length);
    return filtered;
  }, [allPrompts, searchQuery]);

  useEffect(() => {
    setPrompts(filteredPrompts);
  }, [filteredPrompts]);

  const renderItem = useCallback(
    ({
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
    },
    []
  );

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
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <MasonryList
        data={prompts}
        keyExtractor={(item: Prompt): string => item.slug}
        showsVerticalScrollIndicator={true}
        scrollEnabled={true}
        nestedScrollEnabled={true}
        contentContainerStyle={{
          paddingHorizontal: 4,
          paddingTop: 8,
          paddingBottom: 60,
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
