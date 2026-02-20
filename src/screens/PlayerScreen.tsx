import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useTheme } from "../hooks/useTheme";
import { usePlayerStore } from "../store/usePlayerStore";
import { fetchSongDetails } from "../services/api";

const { width } = Dimensions.get("window");

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

const PlayerScreen = ({ navigation }: { navigation: any }) => {
  const {
    currentTrack,
    isPlaying,
    position,
    duration,
    pause,
    resume,
    next,
    previous,
    seekTo,
    toggleFavorite,
    isFavorite,
    isLoading,
    playbackSessionId,
  } = usePlayerStore();
  const { colors, isDark } = useTheme();

  const [showLyrics, setShowLyrics] = useState(false);
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [isSliding, setIsSliding] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [lastSessionId, setLastSessionId] = useState(playbackSessionId);

  // Sync slider with position from store
  useEffect(() => {
    if (!isSliding) {
      setSliderValue(position);
    }
  }, [position, isSliding]);

  // MANDATORY RESET PROTOCOL: 
  // If the session ID changes, we MUST reset local slider state synchronously 
  // during the render cycle to ensure the timeline starts from 0 exactly.
  if (playbackSessionId !== lastSessionId) {
    setSliderValue(0);
    setLastSessionId(playbackSessionId);
  }

  useEffect(() => {
    if (!currentTrack) {
      navigation.goBack();
    } else {
      // Fetch lyrics if not present
      if (!currentTrack.lyrics) {
        setLyrics("Searching for lyrics...");
        fetchSongDetails(currentTrack.id, true).then(details => {
          if (details?.lyrics) {
            setLyrics(details.lyrics);
          } else {
            setLyrics("No lyrics found for this track.");
          }
        });
      } else {
        setLyrics(currentTrack.lyrics);
      }
    }
  }, [currentTrack?.id]);

  if (!currentTrack) return null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-down" size={32} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerContext, { color: colors.text }]} numberOfLines={1}>
          NOW PLAYING
        </Text>
        <TouchableOpacity onPress={() => toggleFavorite(currentTrack)}>
          <Ionicons
            name={isFavorite(currentTrack.id) ? "heart" : "heart-outline"}
            size={28}
            color={isFavorite(currentTrack.id) ? colors.primary : colors.text}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Album Art */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: currentTrack.imageUrl }} style={styles.albumArt} />
        </View>

        {/* Song Info */}
        <View style={styles.infoContainer}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.songTitle, { color: colors.text }]} numberOfLines={1}>
              {currentTrack.title}
            </Text>
            <Text style={[styles.artistName, { color: colors.primary }]} numberOfLines={1}>
              {currentTrack.artist}
            </Text>
          </View>
        </View>

        <View key={playbackSessionId} style={styles.progressContainer}>
          <Slider
            style={styles.progressBar}
            minimumValue={0}
            maximumValue={duration || 1}
            value={sliderValue}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={isDark ? "#333333" : "#F0F0F0"}
            thumbTintColor={colors.primary}
            onValueChange={(value: number) => {
              setIsSliding(true);
              setSliderValue(value);
            }}
            onSlidingComplete={(value: number) => {
              setIsSliding(false);
              seekTo(value);
            }}
          />
          <View style={styles.timeContainer}>
            <Text style={[styles.timeText, { color: colors.gray }]}>{formatTime(sliderValue)}</Text>
            <Text style={[styles.timeText, { color: colors.gray }]}>{formatTime(duration)}</Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controlsRow}>
          <TouchableOpacity onPress={() => { }}>
            <Ionicons name="shuffle" size={24} color={colors.gray} />
          </TouchableOpacity>

          <TouchableOpacity onPress={previous}>
            <Ionicons name="play-skip-back" size={36} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.playButton, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
            onPress={() => isPlaying ? pause() : resume()}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="large" />
            ) : (
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={36}
                color="#FFFFFF"
                style={{ marginLeft: (isPlaying || isLoading) ? 0 : 4 }}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={next}>
            <Ionicons name="play-skip-forward" size={36} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { }}>
            <Ionicons name="repeat" size={24} color={colors.gray} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Lyrics Trigger */}
      <TouchableOpacity
        style={[styles.lyricsTab, { backgroundColor: colors.primary }]}
        onPress={() => setShowLyrics(true)}
      >
        <Ionicons name="chevron-up" size={24} color="#FFFFFF" />
        <Text style={[styles.lyricsTabText, { color: "#FFFFFF" }]}>LYRICS</Text>
      </TouchableOpacity>

      {/* Lyrics Modal */}
      <Modal
        visible={showLyrics}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowLyrics(false)}
      >
        <View style={[styles.lyricsModalContainer, { backgroundColor: colors.primary }]}>
          <View style={styles.lyricsHeader}>
            <TouchableOpacity onPress={() => setShowLyrics(false)}>
              <Ionicons name="chevron-down" size={32} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={[styles.lyricsHeaderTitle, { color: "#FFFFFF" }]}>Lyrics</Text>
            <View style={{ width: 32 }} />
          </View>
          <ScrollView contentContainerStyle={styles.lyricsContent}>
            <Text style={[styles.lyricsFullText, { color: "#FFFFFF" }]}>
              {lyrics}
            </Text>
          </ScrollView>
        </View>
      </Modal>
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
    paddingVertical: 12,
  },
  headerContext: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 2,
    flex: 1,
    textAlign: "center",
    marginHorizontal: 20,
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  imageContainer: {
    width: width - 48,
    height: width - 48,
    borderRadius: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 40,
  },
  albumArt: {
    width: "100%",
    height: "100%",
    borderRadius: 32,
    backgroundColor: "#F0F0F0",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 30,
  },
  songTitle: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 6,
  },
  artistName: {
    fontSize: 18,
    fontWeight: "600",
  },
  progressContainer: {
    width: "100%",
    marginBottom: 40,
  },
  progressBar: {
    width: "100%",
    height: 40,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -8,
  },
  timeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  lyricsTab: {
    position: "absolute",
    bottom: 0,
    left: 20,
    right: 20,
    height: 60,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: "center",
    paddingTop: 8,
  },
  lyricsTabText: {
    fontWeight: "800",
    fontSize: 12,
    letterSpacing: 2,
  },
  lyricsModalContainer: {
    flex: 1,
    paddingTop: 50,
  },
  lyricsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 30,
  },
  lyricsHeaderTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  lyricsContent: {
    paddingHorizontal: 32,
    paddingBottom: 60,
  },
  lyricsFullText: {
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 38,
    textAlign: "center",
  },
});

export default PlayerScreen;
