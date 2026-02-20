import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";
import { useNavigation, useRoute } from "@react-navigation/native";
import { usePlayerStore, Track } from "../store/usePlayerStore";
import { ALL_SONGS } from "../constants/mockData";

const mapToTrack = (song: any): Track => ({
  id: song.id,
  title: song.title,
  artist: song.artist,
  imageUrl: song.image,
  audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  duration: 222,
});

export const FolderDetailsScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { folder } = route.params || {};
  const { playTrack } = usePlayerStore();
  const { colors, isDark } = useTheme();

  // Use a subset of songs to simulate folder content
  const folderSongs = ALL_SONGS.slice(0, 5);
  const folderTracks = folderSongs.map(mapToTrack);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerIcon}>
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
        {/* Folder Info */}
        <View style={styles.folderInfoContainer}>
          <View style={[styles.folderIconContainer, { backgroundColor: isDark ? colors.lightGray : "#FFF4EB" }]}>
            <Ionicons name="folder" size={120} color={colors.primary} />
          </View>
          <Text style={[styles.folderName, { color: colors.text }]}>{folder?.name}</Text>
          <Text style={[styles.folderPath, { color: colors.gray }]} numberOfLines={1}>
            {folder?.path}
          </Text>
          <Text style={[styles.folderStats, { color: colors.gray }]}>
            {folder?.songs} | 02:45:12 mins
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[styles.shuffleButton, { backgroundColor: colors.primary }]}
            onPress={() => {
              const shuffled = [...folderTracks].sort(() => Math.random() - 0.5);
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
              if (folderTracks.length > 0) {
                playTrack(folderTracks[0], folderTracks);
                navigation.navigate("Player");
              }
            }}
          >
            <Ionicons name="play-circle" size={24} color={colors.primary} />
            <Text style={[styles.playButtonText, { color: colors.primary }]}>Play</Text>
          </TouchableOpacity>
        </View>

        {/* Songs Section */}
        <View style={styles.songsHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Songs</Text>
        </View>

        <View style={styles.songsList}>
          {folderSongs.map((item, index) => (
            <View key={item.id} style={styles.songRow}>
              <Image source={{ uri: item.image }} style={[styles.songImage, { backgroundColor: colors.lightGray }]} />
              <View style={styles.songInfo}>
                <Text style={[styles.songTitle, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.songSubtitle, { color: colors.gray }]}>{item.artist}</Text>
              </View>
              <TouchableOpacity onPress={() => {
                playTrack(mapToTrack(item), folderTracks);
                navigation.navigate("Player");
              }}>
                <Ionicons name="play-circle" size={32} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={{ marginLeft: 10 }}>
                <Ionicons
                  name="ellipsis-vertical"
                  size={20}
                  color={colors.gray}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
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
  folderInfoContainer: {
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 24,
  },
  folderIconContainer: {
    width: 200,
    height: 200,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  folderName: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  folderPath: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: "center",
  },
  folderStats: {
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
    elevation: 4,
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
  songsHeader: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
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
  songImage: {
    width: 60,
    height: 60,
    borderRadius: 16,
  },
  songInfo: {
    flex: 1,
    marginLeft: 16,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  songSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
});
