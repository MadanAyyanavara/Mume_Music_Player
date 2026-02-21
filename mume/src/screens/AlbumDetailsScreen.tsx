import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";
import { useNavigation, useRoute } from "@react-navigation/native";
import { usePlayerStore, Track } from "../store/usePlayerStore";
import { fetchAlbumDetails, fetchPlaylistDetails } from "../services/api";

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

export const AlbumDetailsScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { album } = route.params || {};
  const { playTrack } = usePlayerStore();
  const { colors, isDark } = useTheme();

  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<any>(null);
  const [songs, setSongs] = useState<Track[]>([]);

  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      try {
        let res;
        if (album?.type === 'playlist' || !album?.artist) {
          res = await fetchPlaylistDetails(album.id);
        } else {
          res = await fetchAlbumDetails(album.id);
        }

        if (res) {
          setDetails(res);
          setSongs(res.songs || []);
        }
      } catch (error) {
        console.error("Error loading details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (album?.id) {
      loadDetails();
    }
  }, [album]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  const displayImage = details?.image?.[2]?.link || details?.image?.[1]?.link || details?.image || album?.image;
  const displayTitle = details?.name || details?.title || album?.title;
  const displaySubtitle = details?.primaryArtists || details?.artist || album?.artist || (album?.type === 'playlist' ? 'Playlist' : 'Collection');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate("Search")}>
            <Ionicons name="search-outline" size={28} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons
              name="ellipsis-horizontal"
              size={28}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Album Info */}
        <View style={styles.albumInfoContainer}>
          <Image source={{ uri: displayImage }} style={[styles.albumImage, { backgroundColor: colors.lightGray }]} />
          <Text style={[styles.albumTitle, { color: colors.text }]}>{displayTitle}</Text>
          <Text style={[styles.albumStats, { color: colors.gray }]}>
            {displaySubtitle} {details?.year ? `| ${details.year}` : ""} {songs.length ? `| ${songs.length} Songs` : ""}
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[styles.shuffleButton, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
            onPress={() => {
              const shuffled = [...songs].sort(() => Math.random() - 0.5);
              if (shuffled.length > 0) {
                playTrack(shuffled[0], shuffled);
                navigation.navigate("Player");
              }
            }}
          >
            <Ionicons name="shuffle" size={24} color="#FFFFFF" />
            <Text style={[styles.shuffleButtonText, { color: "#FFFFFF" }]}>Shuffle</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.playButton, { backgroundColor: isDark ? colors.lightGray : "#FFF4EB" }]}
            onPress={() => {
              if (songs.length > 0) {
                playTrack(songs[0], songs);
                navigation.navigate("Player");
              }
            }}
          >
            <Ionicons name="play-circle" size={24} color={colors.primary} />
            <Text style={[styles.playButtonText, { color: colors.primary }]}>Play</Text>
          </TouchableOpacity>
        </View>

        {/* Songs List */}
        <View style={styles.songsList}>
          {songs.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={styles.songRow}
              onPress={() => {
                playTrack(item, songs);
                navigation.navigate("Player");
              }}
            >
              <Text style={[styles.songIndex, { color: colors.gray }]}>{index + 1}</Text>
              <View style={styles.songRowInfo}>
                <Text style={[styles.songRowTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
                <Text style={[styles.songRowSubtitle, { color: colors.secondaryText }]} numberOfLines={1}>{item.artist}</Text>
              </View>
              <Text style={[styles.songDuration, { color: colors.gray }]}>
                {item.duration ? formatDuration(item.duration) : ""}
              </Text>
              <TouchableOpacity style={{ marginLeft: 16 }}>
                <Ionicons
                  name="ellipsis-vertical"
                  size={20}
                  color={colors.gray}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
          {songs.length === 0 && (
            <Text style={[styles.emptyText, { color: colors.gray }]}>No songs found in this {album?.type || 'collection'}.</Text>
          )}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerActions: {
    flexDirection: "row",
  },
  headerIcon: {
    marginLeft: 16,
  },
  content: {
    paddingBottom: 40,
  },
  albumInfoContainer: {
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 24,
  },
  albumImage: {
    width: 250,
    height: 250,
    borderRadius: 24,
    marginBottom: 20,
  },
  albumTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  albumStats: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginTop: 24,
    marginBottom: 32,
    justifyContent: "space-between",
  },
  shuffleButton: {
    flex: 1,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginRight: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  shuffleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  playButton: {
    flex: 1,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginLeft: 10,
  },
  playButtonText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  songsList: {
    paddingHorizontal: 24,
  },
  songRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  songIndex: {
    fontSize: 16,
    fontWeight: "600",
    width: 30,
  },
  songRowInfo: {
    flex: 1,
    marginLeft: 8,
    justifyContent: "center",
  },
  songRowTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  songRowSubtitle: {
    fontSize: 13,
    fontWeight: "500",
  },
  songDuration: {
    fontSize: 13,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
  },
});
