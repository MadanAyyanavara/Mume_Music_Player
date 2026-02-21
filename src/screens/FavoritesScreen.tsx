import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";
import { usePlayerStore } from "../store/usePlayerStore";
import { useNavigation } from "@react-navigation/native";
import { SongListItem } from "../components/SongListItem";
import { MiniPlayer } from "../components/MiniPlayer";
import { OptionsModal } from "../components/modals/OptionsModal";

export const FavoritesScreen = () => {
  const navigation = useNavigation<any>();
  const { favorites, downloadedTracks } = usePlayerStore();
  const { colors, isDark } = useTheme();
  const [selectedSong, setSelectedSong] = useState(null);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<"Favorites" | "Downloads">("Favorites");

  const handleOpenOptions = (song: any) => {
    setSelectedSong(song);
    setOptionsModalVisible(true);
  };

  const displayList = activeTab === "Favorites" ? favorites : downloadedTracks;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Library</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Search")}>
          <Ionicons name="search" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={activeTab === "Favorites" ? styles.activeTab : styles.tab}
          onPress={() => setActiveTab("Favorites")}
        >
          <Text style={[activeTab === "Favorites" ? styles.activeTabText : styles.tabText, { color: activeTab === "Favorites" ? colors.primary : colors.gray }]}>
            Favorites
          </Text>
          {activeTab === "Favorites" && <View style={[styles.tabIndicator, { backgroundColor: colors.primary }]} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={activeTab === "Downloads" ? styles.activeTab : styles.tab}
          onPress={() => setActiveTab("Downloads")}
        >
          <Text style={[activeTab === "Downloads" ? styles.activeTabText : styles.tabText, { color: activeTab === "Downloads" ? colors.primary : colors.gray }]}>
            Downloads
          </Text>
          {activeTab === "Downloads" && <View style={[styles.tabIndicator, { backgroundColor: colors.primary }]} />}
        </TouchableOpacity>
      </View>

      {displayList.length > 0 ? (
        <View style={styles.content}>
          <View style={styles.statsRow}>
            <Text style={[styles.statsText, { color: colors.gray }]}>{displayList.length} {activeTab === "Favorites" ? "favorite songs" : "downloaded songs"}</Text>
            <TouchableOpacity style={[styles.playAllBtn, { backgroundColor: colors.primary }]} onPress={() => {
              if (displayList.length > 0) {
                usePlayerStore.getState().playTrack(displayList[0], displayList);
                navigation.navigate("Player");
              }
            }}>
              <Ionicons name="play" size={20} color="#FFFFFF" />
              <Text style={[styles.playAllText, { color: "#FFFFFF" }]}>Play All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={displayList}
            renderItem={({ item, index }) => (
              <SongListItem
                item={item}
                index={index}
                playlist={displayList}
                onOpenOptions={handleOpenOptions}
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listPadding}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIconBg, { backgroundColor: colors.lightGray }]}>
            <Ionicons name={activeTab === "Favorites" ? "heart-outline" : "download-outline"} size={60} color={colors.primary} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Nothing here yet</Text>
          <Text style={[styles.emptySubtitle, { color: colors.gray }]}>
            {activeTab === "Favorites"
              ? "Start adding your favorite songs and they'll show up here!"
              : "Download songs from their options menu to listen offline."
            }
          </Text>
          <TouchableOpacity
            style={[styles.exploreBtn, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={[styles.exploreBtnText, { color: "#FFFFFF" }]}>Explore Music</Text>
          </TouchableOpacity>
        </View>
      )}

      <MiniPlayer />

      <OptionsModal
        visible={optionsModalVisible}
        onClose={() => setOptionsModalVisible(false)}
        selectedSong={selectedSong}
      />
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
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.1)'
  },
  tab: {
    marginRight: 24,
    paddingBottom: 12,
  },
  activeTab: {
    marginRight: 24,
    paddingBottom: 12,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
  },
  activeTabText: {
    fontSize: 16,
    fontWeight: "700",
  },
  tabIndicator: {
    position: "absolute",
    bottom: -1,
    left: 0,
    right: 0,
    height: 3,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  content: {
    flex: 1,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  statsText: {
    fontSize: 16,
    fontWeight: "600",
  },
  playAllBtn: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: "center",
  },
  playAllText: {
    fontWeight: "700",
    marginLeft: 6,
  },
  listPadding: {
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIconBg: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  exploreBtn: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 28,
  },
  exploreBtnText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
