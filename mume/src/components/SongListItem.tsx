import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { usePlayerStore, Track } from "../store/usePlayerStore";
import { useTheme } from "../hooks/useTheme";
import { useNavigation } from "@react-navigation/native";

interface SongItemProps {
  item: any;
  index: number;
  playlist: any[];
  onOpenOptions: (item: any) => void;
}

export const SongListItem = ({
  item,
  index,
  playlist,
  onOpenOptions,
}: SongItemProps) => {
  const { currentTrack, isPlaying, playTrack, pause, resume } =
    usePlayerStore();
  const navigation = useNavigation<any>();
  const { colors, isDark } = useTheme();

  const isCurrent = currentTrack?.id === item.id;

  const mapToTrack = (i: any): Track => ({
    id: i.id,
    title: i.title || i.name || "Unknown Title",
    artist: i.artist || "Unknown Artist",
    imageUrl: i.imageUrl || i.image || "",
    audioUrl: i.audioUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: i.duration || 0,
  });

  const handlePress = () => {
    const track = mapToTrack(item);
    const queue = playlist.map(mapToTrack);
    playTrack(track, queue);
    navigation.navigate("Player");
  };

  const handlePlayPause = () => {
    if (isCurrent) {
      if (isPlaying) pause();
      else resume();
    } else {
      const track = mapToTrack(item);
      const queue = playlist.map(mapToTrack);
      playTrack(track, queue);
    }
  };

  return (
    <TouchableOpacity style={styles.songListItem} onPress={handlePress}>
      <Image source={{ uri: item.imageUrl || item.image }} style={styles.songListImage} />
      <View style={styles.songListInfo}>
        <Text
          style={[styles.songListTitle, { color: isCurrent ? colors.primary : colors.text }]}
          numberOfLines={1}
        >
          {item.title || item.name}
        </Text>
        <Text style={[styles.songListSubtitle, { color: colors.secondaryText }]} numberOfLines={1}>
          {item.artist} {item.duration ? `| ${item.duration}` : ""}
        </Text>
      </View>
      <View style={styles.songListActions}>
        <TouchableOpacity
          style={[styles.playIconContainer, { backgroundColor: colors.primary }]}
          onPress={handlePlayPause}
        >
          <Ionicons
            name={isCurrent && isPlaying ? "pause" : "play"}
            size={18}
            color="#FFFFFF"
            style={{ marginLeft: isCurrent && isPlaying ? 0 : 2 }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onOpenOptions(item)}>
          <Ionicons name="ellipsis-vertical" size={20} color={colors.gray} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  songListItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  songListImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  songListInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "center",
  },
  songListTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  songListSubtitle: {
    fontSize: 13,
    fontWeight: "500",
  },
  songListActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  playIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
});
