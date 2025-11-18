import { createContext, useContext, useState, ReactNode } from "react";

type SearchContextType = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSetSearchQuery = (query: string) => {
    console.log("SearchContext - setSearchQuery llamado con:", query);
    setSearchQuery(query);
  };

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery: handleSetSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}

