import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  Keyboard,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";
import { useNavigation } from "@react-navigation/native";
import { usePlayerStore, Track } from "../store/usePlayerStore";
import {
  fetchSongs,
  fetchAlbums,
  fetchArtists,
  fetchPlaylists,
  fetchGlobalSearch,
  fetchSongDetails
} from "../services/api";

const SEARCH_TABS = ["Songs", "Artists", "Albums", "Folders"];
const PAGE_LIMIT = 20;

export const SearchScreen = () => {
  const navigation = useNavigation<any>();
  const { playTrack } = usePlayerStore();
  const { colors, isDark } = useTheme();

  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Songs");
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [globalResults, setGlobalResults] = useState<any>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const inputRef = useRef<TextInput>(null);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const performSearch = async (text: string, tab: string, isLoadMore = false) => {
    if (!text.trim()) {
      setResults([]);
      setGlobalResults(null);
      return;
    }

    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setPage(0);
      setHasMore(true);
    }

    try {
      const currentPage = isLoadMore ? page + 1 : 0;
      let newResults: any[] = [];

      if (tab === "All") {
        const data = await fetchGlobalSearch(text);
        setGlobalResults(data);
        setHasMore(false); // Global search usually doesn't paginate well in this UI structure
      } else if (tab === "Songs") {
        const songs = await fetchSongs(text, currentPage, PAGE_LIMIT);
        newResults = songs
          .filter((s: any) => (s.title || s.name || "").toLowerCase().includes(text.toLowerCase()))
          .map((s: any) => ({ ...s, type: "song" }));
      } else if (tab === "Albums") {
        const albums = await fetchAlbums(text, currentPage, PAGE_LIMIT);
        newResults = albums
          .filter((a: any) => (a.title || a.name || "").toLowerCase().includes(text.toLowerCase()))
          .map((a: any) => ({ ...a, type: "album" }));
      } else if (tab === "Artists") {
        const artists = await fetchArtists(text, currentPage, PAGE_LIMIT);
        newResults = artists
          .filter((a: any) => (a.title || a.name || "").toLowerCase().includes(text.toLowerCase()))
          .map((a: any) => ({ ...a, type: "artist" }));
      } else if (tab === "Folders" || tab === "Playlists") {
        const playlists = await fetchPlaylists(text, currentPage, PAGE_LIMIT);
        newResults = playlists
          .filter((p: any) => (p.title || p.name || "").toLowerCase().includes(text.toLowerCase()))
          .map((p: any) => ({ ...p, type: "playlist" }));
      }

      if (isLoadMore) {
        setResults(prev => [...prev, ...newResults]);
        setPage(currentPage);
      } else {
        setResults(newResults);
      }

      if (newResults.length < PAGE_LIMIT && tab !== "All") {
        setHasMore(false);
      }

    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleSearchChange = (text: string) => {
    setQuery(text);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (text.length > 1) {
      searchTimeout.current = setTimeout(() => {
        performSearch(text, activeTab);
      }, 500);
    } else if (text.length === 0) {
      setResults([]);
      setGlobalResults(null);
    }
  };

  const onTabPress = (tab: string) => {
    setActiveTab(tab);
    if (query.trim()) {
      performSearch(query, tab);
    }
  };

  const handleResultPress = async (item: any) => {
    if (item.type === "song") {
      let trackToPlay = item;

      if (!item.audioUrl) {
        setPlayingId(item.id);
        const details = await fetchSongDetails(item.id);
        setPlayingId(null);
        if (details) {
          trackToPlay = details;
        } else {
          return;
        }
      }

      playTrack(trackToPlay, [trackToPlay]);
      navigation.navigate("Player");
    } else if (item.type === "artist") {
      navigation.navigate("ArtistDetails", { artist: item });
    } else if (item.type === "album") {
      navigation.navigate("AlbumDetails", { album: item });
    } else if (item.type === "playlist") {
      navigation.navigate("AlbumDetails", { album: { ...item, type: 'playlist' } });
    }
  };

  const loadMore = () => {
    if (!loading && !loadingMore && hasMore && query.trim() && activeTab !== "All") {
      performSearch(query, activeTab, true);
    }
  };

  const renderTab = (tab: string) => (
    <TouchableOpacity
      key={tab}
      style={[
        styles.tab,
        activeTab === tab
          ? { backgroundColor: colors.primary, borderColor: colors.primary }
          : { backgroundColor: 'transparent', borderColor: colors.primary }
      ]}
      onPress={() => onTabPress(tab)}
    >
      <Text style={[
        styles.tabText,
        activeTab === tab
          ? { color: "#FFFFFF" }
          : { color: colors.primary }
      ]}>
        {tab}
      </Text>
    </TouchableOpacity>
  );

  const renderResultItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleResultPress(item)}
      disabled={playingId === item.id}
    >
      <View>
        <Image
          source={{ uri: item.imageUrl || (item.image && (item.image[2]?.url || item.image[2]?.link || item.image[1]?.url || item.image[1]?.link)) || item.image }}
          style={[styles.resultImage, { backgroundColor: colors.lightGray }, item.type === "artist" && styles.artistImage]}
        />
        {playingId === item.id && (
          <View style={[styles.itemLoader, { backgroundColor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)' }]}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        )}
      </View>
      <View style={styles.resultInfo}>
        <Text style={[styles.resultTitle, { color: colors.text }]} numberOfLines={1}>{item.title || item.name}</Text>
        <Text style={[styles.resultSubtitle, { color: colors.secondaryText }]} numberOfLines={1}>
          {item.type.charAt(0).toUpperCase() + item.type.slice(1)} {item.artist ? `• ${item.artist}` : ""}
        </Text>
      </View>
      {item.type === "song" && (
        <Ionicons name="play-circle" size={32} color={colors.primary} />
      )}
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loadingMore) return <View style={{ height: 20 }} />;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.notFoundContainer}>
      <Ionicons name="search-outline" size={100} color={colors.primary} style={{ marginBottom: 20 }} />
      <Text style={[styles.notFoundTitle, { color: colors.text }]}>Not Found</Text>
      <Text style={[styles.notFoundText, { color: colors.gray }]}>
        Sorry, the keyword you entered cannot be found, please check again or search with another keyword.
      </Text>
    </View>
  );

  const renderGlobalSection = (title: string, data: any[], type: string) => {
    if (!data || data.length === 0) return null;
    return (
      <View style={styles.globalSection}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
          <TouchableOpacity onPress={() => onTabPress(title)}>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>
        {data.slice(0, 3).map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.resultItem}
            onPress={() => handleResultPress({ ...item, type })}
            disabled={playingId === item.id}
          >
            <View>
              <Image
                source={{ uri: (item.image && (item.image[2]?.url || item.image[2]?.link || item.image[1]?.url || item.image[1]?.link)) || item.image }}
                style={[styles.resultImage, { backgroundColor: colors.lightGray }, type === "artist" && styles.artistImage]}
              />
              {playingId === item.id && (
                <View style={[styles.itemLoader, { backgroundColor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)' }]}>
                  <ActivityIndicator size="small" color={colors.primary} />
                </View>
              )}
            </View>
            <View style={styles.resultInfo}>
              <Text style={[styles.resultTitle, { color: colors.text }]} numberOfLines={1}>{item.title || item.name}</Text>
              <Text style={[styles.resultSubtitle, { color: colors.secondaryText }]} numberOfLines={1}>
                {item.artist || item.description || (type === "artist" ? "Artist" : "")}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const isGlobalEmpty = globalResults && (
    (globalResults.songs?.results?.length || 0) +
    (globalResults.albums?.results?.length || 0) +
    (globalResults.artists?.results?.length || 0) +
    (globalResults.playlists?.results?.length || 0) === 0
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={[styles.searchBarContainer, { backgroundColor: isDark ? "#1C1C1E" : "#F4F4F5" }]}>
          <Ionicons name="search" size={20} color={colors.gray} />
          <TextInput
            ref={inputRef}
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search for songs, artists..."
            value={query}
            onChangeText={handleSearchChange}
            placeholderTextColor={colors.gray}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => handleSearchChange("")}>
              <Ionicons name="close-outline" size={24} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScrollContent}>
          {SEARCH_TABS.map(renderTab)}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : query.trim() === "" ? (
        <View style={styles.centerContainer}>
          <Ionicons name="search" size={80} color={isDark ? "#2C2C2C" : "#F0F0F0"} />
          <Text style={[styles.emptyText, { color: colors.gray }]}>Search for songs, artists, albums...</Text>
        </View>
      ) : activeTab === "All" && globalResults ? (
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {isGlobalEmpty ? (
            renderEmptyState()
          ) : (
            <>
              {renderGlobalSection("Songs", globalResults.songs?.results || [], "song")}
              {renderGlobalSection("Albums", globalResults.albums?.results || [], "album")}
              {renderGlobalSection("Artists", globalResults.artists?.results || [], "artist")}
              {renderGlobalSection("Playlists", globalResults.playlists?.results || [], "playlist")}
            </>
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      ) : (
        <FlatList
          style={{ flex: 1 }}
          data={results}
          renderItem={renderResultItem}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerStyle={styles.resultsList}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmptyState()}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    marginLeft: 16,
    paddingHorizontal: 12,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
  },
  tabsContainer: {
    paddingVertical: 10,
  },
  tabsScrollContent: {
    paddingHorizontal: 20,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 1,
  },
  activeTab: {},
  tabText: {
    fontSize: 14,
    fontWeight: "500",
  },
  activeTabText: {},
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultsList: {
    paddingHorizontal: 20,
    paddingTop: 10,
    flexGrow: 1,
  },
  globalSection: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  resultImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  artistImage: {
    borderRadius: 28,
  },
  resultInfo: {
    flex: 1,
    marginLeft: 16,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  resultSubtitle: {
    fontSize: 13,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: "center",
  },
  itemLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 32,
  },
  notFoundImage: {
    width: 320,
    height: 320,
    marginBottom: 24,
  },
  notFoundTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  notFoundText: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
});
