import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";
import { useNavigation, useRoute } from "@react-navigation/native";
import { usePlayerStore, Track } from "../store/usePlayerStore";
import { fetchArtistDetails, fetchArtistSongs, fetchArtistAlbums } from "../services/api";
import { MiniPlayer } from "../components/MiniPlayer";

export const ArtistDetailsScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { artist } = route.params || {};
  const { playTrack } = usePlayerStore();
  const { colors, isDark } = useTheme();

  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<any>(null);
  const [songs, setSongs] = useState<Track[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (!artist?.id) return;
      setLoading(true);
      try {
        const [artistInfo, artistSongs, artistAlbums] = await Promise.all([
          fetchArtistDetails(artist.id),
          fetchArtistSongs(artist.id, 0, "popularity"),
          fetchArtistAlbums(artist.id, 0, "latest")
        ]);

        setDetails(artistInfo);
        setSongs(artistSongs);
        setAlbums(artistAlbums);
      } catch (error) {
        console.error("Error loading artist data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [artist?.id]);

  const handleShuffle = () => {
    const shuffled = [...songs].sort(() => Math.random() - 0.5);
    if (shuffled.length > 0) {
      playTrack(shuffled[0], shuffled);
      navigation.navigate("Player");
    }
  };

  const handlePlay = () => {
    if (songs.length > 0) {
      playTrack(songs[0], songs);
      navigation.navigate("Player");
    }
  };

  if (loading && !details) {
    return (
      <SafeAreaView style={[styles.container, styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  const displayImage = details?.imageUrl || artist?.imageUrl || artist?.image;
  const displayName = details?.name || artist?.name || "Artist";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate("Search")}>
          <Ionicons name="search-outline" size={28} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.artistInfoContainer}>
          <Image source={{ uri: displayImage }} style={[styles.artistImage, { backgroundColor: colors.lightGray }]} />
          <Text style={[styles.artistName, { color: colors.text }]}>{displayName}</Text>
          <Text style={[styles.artistStats, { color: colors.gray }]}>
            {details?.followerCount ? `${details.followerCount} followers | ` : ""}
            {songs.length} Top Songs
          </Text>
        </View>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[styles.shuffleButton, { backgroundColor: colors.primary }]}
            onPress={handleShuffle}
          >
            <Ionicons name="shuffle" size={24} color="#FFFFFF" />
            <Text style={[styles.shuffleButtonText, { color: "#FFFFFF" }]}>Shuffle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.playButton, { backgroundColor: isDark ? colors.lightGray : "#FFF4EB" }]} onPress={handlePlay}>
            <Ionicons name="play-circle" size={24} color={colors.primary} />
            <Text style={[styles.playButtonText, { color: colors.primary }]}>Play</Text>
          </TouchableOpacity>
        </View>

        {songs.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Top Tracks</Text>
            </View>
            <View style={styles.songsList}>
              {songs.slice(0, 10).map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.songRow}
                  onPress={() => {
                    playTrack(item, songs);
                    navigation.navigate("Player");
                  }}
                >
                  <Image source={{ uri: item.imageUrl }} style={[styles.songRowImage, { backgroundColor: colors.lightGray }]} />
                  <View style={styles.songRowInfo}>
                    <Text style={[styles.songRowTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
                    <Text style={[styles.songRowSubtitle, { color: colors.secondaryText }]} numberOfLines={1}>{item.artist}</Text>
                  </View>
                  <Ionicons name="play-circle" size={32} color={colors.primary} />
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {albums.length > 0 && (
          <>
            <View style={[styles.sectionHeader, { marginTop: 24 }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Albums</Text>
            </View>
            <FlatList
              data={albums}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingLeft: 24, paddingRight: 24 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.albumCard}
                  onPress={() => navigation.navigate("AlbumDetails", { album: item })}
                >
                  <Image source={{ uri: item.imageUrl }} style={[styles.albumCardImage, { backgroundColor: colors.lightGray }]} />
                  <Text style={[styles.albumCardTitle, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
                  <Text style={[styles.albumCardSubtitle, { color: colors.gray }]}>{item.year || item.type}</Text>
                </TouchableOpacity>
              )}
            />
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
      <MiniPlayer />
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
  headerIcon: {
    marginLeft: 16,
  },
  content: {
    paddingBottom: 40,
  },
  artistInfoContainer: {
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 24,
  },
  artistImage: {
    width: 250,
    height: 250,
    borderRadius: 125,
    marginBottom: 20,
  },
  artistName: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  artistStats: {
    fontSize: 14,
    fontWeight: "500",
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
  sectionHeader: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
  },
  songsList: {
    paddingHorizontal: 24,
  },
  songRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  songRowImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  songRowInfo: {
    flex: 1,
    marginLeft: 16,
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
  albumCard: {
    width: 140,
    marginRight: 16,
  },
  albumCardImage: {
    width: 140,
    height: 140,
    borderRadius: 16,
    marginBottom: 8,
  },
  albumCardTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  albumCardSubtitle: {
    fontSize: 12,
  },
});
