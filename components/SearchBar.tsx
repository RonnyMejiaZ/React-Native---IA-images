import { useState } from "react";
import { TextInput, View, Pressable, Text } from "react-native";
import { styled } from "nativewind";

const StyledTextInput = styled(TextInput);
const StyledPressable = styled(Pressable);

type SearchBarProps = {
  onSearch: (query: string) => void;
  placeholder?: string;
};

export function SearchBar({ onSearch, placeholder = "Buscar..." }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleTextChange = (text: string) => {
    setSearchQuery(text);
    const trimmed = text.trim();
    console.log("SearchBar - Texto cambiado:", trimmed);
    onSearch(trimmed);
  };

  const handleSearch = () => {
    onSearch(searchQuery.trim());
  };

  const handleClear = () => {
    setSearchQuery("");
    onSearch("");
  };

  return (
    <View className="flex-row items-center bg-gray-800 rounded-lg px-3 py-1.5 mx-2" style={{ minWidth: 200, maxWidth: 250 }}>
      <StyledTextInput
        value={searchQuery}
        onChangeText={handleTextChange}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        className="flex-1 text-white text-sm"
        onSubmitEditing={handleSearch}
        returnKeyType="search"
        style={{ color: "#fff", fontSize: 14 }}
      />
      {searchQuery.length > 0 && (
        <Pressable onPress={handleClear} className="ml-2">
          <View className="w-5 h-5 rounded-full bg-gray-600 items-center justify-center">
            <Text className="text-white text-xs font-bold">×</Text>
          </View>
        </Pressable>
      )}
    </View>
  );
}

