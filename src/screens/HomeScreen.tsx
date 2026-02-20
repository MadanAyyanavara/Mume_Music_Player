import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";
import { SectionHeader } from "../components/SectionHeader";
import {
  FOLDERS,
} from "../constants/mockData";
import { useNavigation } from "@react-navigation/native";
import { usePlayerStore, Track } from "../store/usePlayerStore";
import { fetchSongs, fetchTrendingSongs, fetchArtists, fetchAlbums } from "../services/api";

// Components
import { MiniPlayer } from "../components/MiniPlayer";
import { SongListItem } from "../components/SongListItem";
import { SortModal } from "../components/modals/SortModal";
import { OptionsModal } from "../components/modals/OptionsModal";
import { ArtistOptionsModal } from "../components/modals/ArtistOptionsModal";

const TABS = ["Suggested", "Songs", "Artists", "Albums", "Folders"];

export const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const { playTrack, homeActiveTab: activeTab, setHomeActiveTab: setActiveTab } = usePlayerStore();
  const { colors, isDark } = useTheme();

  // UI State
  // UI State
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [artistOptionsModalVisible, setArtistOptionsModalVisible] =
    useState(false);
  const [selectedSong, setSelectedSong] = useState<any>(null);
  const [selectedArtist, setSelectedArtist] = useState<any>(null);

  // API Data
  const [trendingSongs, setTrendingSongs] = useState<Track[]>([]);
  const [newReleases, setNewReleases] = useState<Track[]>([]);
  const [homeArtists, setHomeArtists] = useState<any[]>([]);
  const [homeAlbums, setHomeAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Sort State
  const [sortBy, setSortBy] = useState("Ascending");
  const [sortedSongs, setSortedSongs] = useState<Track[]>([]);

  useEffect(() => {
    const loadHomeData = async () => {
      setLoading(true);
      try {
        const [trending, newSongs, artists, albums] = await Promise.all([
          fetchTrendingSongs(),
          fetchSongs("Latest Hits"),
          fetchArtists("Top Artists"),
          fetchAlbums("Latest Albums")
        ]);

        setTrendingSongs(trending);
        setNewReleases(newSongs);
        setHomeArtists(artists);
        setHomeAlbums(albums);
        setSortedSongs(trending);
      } catch (err) {
        console.error("Home data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  useEffect(() => {
    if (trendingSongs.length === 0) return;

    let sorted = [...trendingSongs];
    switch (sortBy) {
      case "Ascending":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "Descending":
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "Artist":
        sorted.sort((a, b) => a.artist.localeCompare(b.artist));
        break;
      default:
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    setSortedSongs(sorted);
  }, [sortBy, trendingSongs]);

  const handleSort = (option: string) => {
    setSortBy(option);
    setSortModalVisible(false);
  };

  const handleOpenOptions = (song: any) => {
    setSelectedSong(song);
    setOptionsModalVisible(true);
  };

  const handleOpenArtistOptions = (artist: any) => {
    setSelectedArtist(artist);
    setArtistOptionsModalVisible(true);
  };

  const renderTab = ({ item }: { item: string }) => {
    const isActive = activeTab === item;
    return (
      <TouchableOpacity
        style={[styles.tabButton, isActive && styles.activeTabButton]}
        onPress={() => setActiveTab(item)}
      >
        <Text style={[styles.tabText, { color: isActive ? colors.primary : colors.gray }, isActive && styles.activeTabText]}>
          {item}
        </Text>
        {isActive && <View style={[styles.tabIndicator, { backgroundColor: colors.primary }]} />}
      </TouchableOpacity>
    );
  };

  const renderCardItem = (item: Track, index: number, playlist: Track[]) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => {
        playTrack(item, playlist);
        navigation.navigate("Player");
      }}
    >
      <Image source={{ uri: item.imageUrl }} style={[styles.cardImage, { backgroundColor: colors.lightGray }]} />
      <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={[styles.cardSubtitle, { color: colors.secondaryText }]} numberOfLines={1}>
        {item.artist}
      </Text>
    </TouchableOpacity>
  );

  const renderArtistCircleItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.artistContainer}
      onPress={() => navigation.navigate("ArtistDetails", { artist: item })}
    >
      <Image source={{ uri: item.imageUrl }} style={[styles.artistImage, { backgroundColor: colors.lightGray }]} />
      <Text style={[styles.artistName, { color: colors.text }]} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderArtistListItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.artistListItem}
      onPress={() => navigation.navigate("ArtistDetails", { artist: item })}
    >
      <Image source={{ uri: item.imageUrl }} style={[styles.artistListImage, { backgroundColor: colors.lightGray }]} />
      <View style={styles.artistListInfo}>
        <Text style={[styles.artistListTitle, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.artistListSubtitle, { color: colors.secondaryText }]}>
          {item.role || "Artist"} {item.followerCount ? `| ${item.followerCount} followers` : ""}
        </Text>
      </View>
      <TouchableOpacity onPress={() => handleOpenArtistOptions(item)}>
        <Ionicons name="ellipsis-vertical" size={20} color={colors.gray} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderAlbumGridItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.albumGridItem}
      onPress={() => navigation.navigate("AlbumDetails", { album: item })}
    >
      <Image source={{ uri: item.imageUrl }} style={[styles.albumGridImage, { backgroundColor: colors.lightGray }]} />
      <View style={styles.albumInfoRow}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.albumGridTitle, { color: colors.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.albumGridSubtitle, { color: colors.secondaryText }]} numberOfLines={1}>
            {item.artist} {item.year ? `| ${item.year}` : ""}
          </Text>
          {item.songCount && <Text style={[styles.albumGridSongs, { color: colors.gray }]}>{item.songCount} Songs</Text>}
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={20} color={colors.gray} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderFolderListItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.folderListItem}
      onPress={() => navigation.navigate("FolderDetails", { folder: item })}
    >
      <View style={[styles.folderIconBg, { backgroundColor: colors.lightGray }]}>
        <Ionicons name="folder" size={32} color={colors.primary} />
      </View>
      <View style={styles.folderInfo}>
        <Text style={[styles.folderName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.folderSubtitle, { color: colors.secondaryText }]}>
          {item.songs} | {item.path}
        </Text>
      </View>
      <TouchableOpacity>
        <Ionicons name="ellipsis-vertical" size={20} color={colors.gray} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="musical-notes" size={28} color={colors.primary} />
          <Text style={[styles.headerTitle, { color: colors.text }]}>Mume</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Search")}>
          <Ionicons name="search-outline" size={28} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Categories / Tabs */}
      <View style={[styles.tabsContainer, { borderBottomColor: colors.border }]}>
        <FlatList
          data={TABS}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderTab}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.tabsContent}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loaderText, { color: colors.gray }]}>Tuning your experience...</Text>
          </View>
        ) : (
          <>
            {activeTab === "Suggested" ? (
              <>
                <SectionHeader title="Trending Now" onSeeAll={() => { }} />
                <FlatList
                  data={trendingSongs}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item, index }) =>
                    renderCardItem(item, index, trendingSongs)
                  }
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.listContent}
                />

                <SectionHeader title="Top Artists" onSeeAll={() => { }} />
                <FlatList
                  data={homeArtists}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={renderArtistCircleItem}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.listContent}
                />

                <SectionHeader title="Latest Hits" onSeeAll={() => { }} />
                <FlatList
                  data={newReleases}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item, index }) =>
                    renderCardItem(item, index, newReleases)
                  }
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.listContent}
                />
              </>
            ) : activeTab === "Songs" ? (
              <>
                <View style={styles.songsHeader}>
                  <Text style={[styles.songsCount, { color: colors.text }]}>{sortedSongs.length} songs</Text>
                  <TouchableOpacity
                    style={styles.sortButton}
                    onPress={() => setSortModalVisible(true)}
                  >
                    <Text style={[styles.sortText, { color: colors.primary }]}>{sortBy}</Text>
                    <Ionicons
                      name="swap-vertical"
                      size={16}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.songsListContainer}>
                  {sortedSongs.map((item, index) => (
                    <View key={item.id}>
                      <SongListItem
                        item={item}
                        index={index}
                        playlist={sortedSongs}
                        onOpenOptions={handleOpenOptions}
                      />
                    </View>
                  ))}
                </View>
              </>
            ) : activeTab === "Artists" ? (
              <>
                <View style={styles.songsHeader}>
                  <Text style={[styles.songsCount, { color: colors.text }]}>{homeArtists.length} artists</Text>
                </View>
                <View style={styles.songsListContainer}>
                  {homeArtists.map((item) => (
                    <View key={item.id}>{renderArtistListItem({ item })}</View>
                  ))}
                </View>
              </>
            ) : activeTab === "Albums" ? (
              <>
                <View style={styles.songsHeader}>
                  <Text style={[styles.songsCount, { color: colors.text }]}>{homeAlbums.length} albums</Text>
                </View>
                <View style={styles.albumsGridContainer}>
                  <FlatList
                    key={"albums-grid"}
                    data={homeAlbums}
                    numColumns={2}
                    renderItem={renderAlbumGridItem}
                    keyExtractor={(item) => item.id}
                    columnWrapperStyle={{ justifyContent: "space-between" }}
                    scrollEnabled={false}
                  />
                </View>
              </>
            ) : activeTab === "Folders" ? (
              <>
                <View style={styles.songsHeader}>
                  <Text style={[styles.songsCount, { color: colors.text }]}>{FOLDERS.length} folders</Text>
                </View>
                <View style={styles.songsListContainer}>
                  {FOLDERS.map((item) => (
                    <View key={item.id}>{renderFolderListItem({ item })}</View>
                  ))}
                </View>
              </>
            ) : (
              <View style={styles.placeholderContainer}>
                <Text style={{ color: colors.gray }}>No content found</Text>
              </View>
            )}
          </>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      <MiniPlayer />

      <SortModal
        visible={sortModalVisible}
        onClose={() => setSortModalVisible(false)}
        onSort={handleSort}
        sortBy={sortBy}
      />

      <OptionsModal
        visible={optionsModalVisible}
        onClose={() => setOptionsModalVisible(false)}
        selectedSong={selectedSong}
      />

      <ArtistOptionsModal
        visible={artistOptionsModalVisible}
        onClose={() => setArtistOptionsModalVisible(false)}
        selectedArtist={selectedArtist}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000000",
    marginLeft: 12,
    letterSpacing: -0.5,
  },
  tabsContainer: {
    marginTop: 10,
    marginBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
  },
  tabsContent: {
    paddingHorizontal: 24,
  },
  tabButton: {
    paddingVertical: 12,
    marginRight: 32,
    alignItems: "center",
  },
  activeTabButton: {},
  tabText: {
    fontSize: 18,
    color: "#9E9E9E",
    fontWeight: "600",
  },
  activeTabText: {
    fontWeight: "700",
  },
  tabIndicator: {
    position: "absolute",
    bottom: -1.5,
    width: 30,
    left: 0,
    right: 0,
    height: 3,
    borderRadius: 2,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  cardContainer: {
    marginRight: 20,
    width: 148,
  },
  cardImage: {
    width: 148,
    height: 148,
    borderRadius: 24,
    backgroundColor: "#F0F0F0",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 4,
    lineHeight: 22,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
  },
  artistContainer: {
    marginRight: 24,
    alignItems: "center",
    width: 110,
  },
  artistImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#F0F0F0",
    marginBottom: 12,
  },
  artistName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
    textAlign: "center",
  },
  songsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  songsCount: {
    fontSize: 20,
    fontWeight: "700",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  sortText: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 4,
  },
  songsListContainer: {
    paddingHorizontal: 24,
  },
  placeholderContainer: {
    padding: 100,
    alignItems: "center",
  },
  loaderContainer: {
    paddingVertical: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  loaderText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "500",
  },
  // Artist List Styles
  artistListItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  artistListImage: {
    width: 60,
    height: 60,
    borderRadius: 30, // Circular
    backgroundColor: "#F0F0F0",
  },
  artistListInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "center",
  },
  artistListTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  artistListSubtitle: {
    fontSize: 13,
    fontWeight: "500",
  },
  // Album Grid Styles
  albumsGridContainer: {
    paddingHorizontal: 24,
  },
  albumGridItem: {
    width: "47%",
    marginBottom: 24,
  },
  albumGridImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    marginBottom: 12,
  },
  albumInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  albumGridTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  albumGridSubtitle: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 2,
  },
  albumGridSongs: {
    fontSize: 12,
  },
  // Folder List Styles
  folderListItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  folderIconBg: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: "#FFF4EB",
    justifyContent: "center",
    alignItems: "center",
  },
  folderInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "center",
  },
  folderName: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  folderSubtitle: {
    fontSize: 12,
    fontWeight: "500",
  },
});

export default HomeScreen;
