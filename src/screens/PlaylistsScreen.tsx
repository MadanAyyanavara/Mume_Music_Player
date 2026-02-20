import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";
import { useNavigation } from "@react-navigation/native";
import { fetchPlaylists } from "../services/api";
import { MiniPlayer } from "../components/MiniPlayer";

export const PlaylistsScreen = () => {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const { colors, isDark } = useTheme();

  useEffect(() => {
    const loadPlaylists = async () => {
      setLoading(true);
      try {
        const data = await fetchPlaylists("Top Global");
        setPlaylists(data);
      } catch (error) {
        console.error("Error loading playlists:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPlaylists();
  }, []);

  const renderPlaylistItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.playlistItem, { backgroundColor: colors.white }]}
      onPress={() => navigation.navigate("AlbumDetails", { album: { ...item, type: 'playlist' } })}
    >
      <Image source={{ uri: item.imageUrl }} style={[styles.playlistImage, { backgroundColor: colors.lightGray }]} />
      <View style={styles.playlistInfo}>
        <Text style={[styles.playlistTitle, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
        <Text style={[styles.playlistSubtitle, { color: colors.secondaryText }]}>
          {item.songCount || '0'} Songs | {item.language || 'English'}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.gray} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Discovery</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Search")}>
          <Ionicons name="search" size={26} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.activeTab}>
          <Text style={[styles.activeTabText, { color: colors.primary }]}>Playlists</Text>
          <View style={[styles.tabIndicator, { backgroundColor: colors.primary }]} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={[styles.tabText, { color: colors.gray }]}>Charts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={[styles.tabText, { color: colors.gray }]}>New</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.gray }]}>Fetching collections...</Text>
        </View>
      ) : (
        <FlatList
          data={playlists}
          renderItem={renderPlaylistItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.gray }]}>No playlists found</Text>
            </View>
          }
        />
      )}

      <MiniPlayer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -1,
  },
  tabBar: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginBottom: 16,
    marginTop: 12,
  },
  tab: {
    marginRight: 24,
    paddingVertical: 8,
  },
  activeTab: {
    marginRight: 24,
    paddingVertical: 8,
  },
  tabText: {
    fontSize: 18,
    fontWeight: "600",
  },
  activeTabText: {
    fontSize: 18,
    fontWeight: "700",
  },
  tabIndicator: {
    height: 3,
    borderRadius: 2,
    marginTop: 4,
    width: 20,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  playlistItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  playlistImage: {
    width: 70,
    height: 70,
    borderRadius: 16,
  },
  playlistInfo: {
    flex: 1,
    marginLeft: 16,
  },
  playlistTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 4,
  },
  playlistSubtitle: {
    fontSize: 13,
    fontWeight: "500",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  emptyContainer: {
    paddingTop: 100,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
  },
});
