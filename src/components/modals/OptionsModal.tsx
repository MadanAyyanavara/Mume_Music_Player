import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../hooks/useTheme";

interface OptionsModalProps {
  visible: boolean;
  onClose: () => void;
  selectedSong: any;
}

// Actions moved inside component

import { usePlayerStore } from "../../store/usePlayerStore";

export const OptionsModal = ({
  visible,
  onClose,
  selectedSong,
}: OptionsModalProps) => {
  const { colors, isDark } = useTheme();
  const { isDownloaded, downloadTrack, removeDownload } = usePlayerStore();

  if (!selectedSong) return null;

  const downloaded = isDownloaded(selectedSong.id);

  const ACTIONS = [
    { icon: downloaded ? "checkmark-circle" : "download-outline", label: downloaded ? "Remove Download" : "Download Offline" },
    { icon: "arrow-forward-circle-outline", label: "Play Next" },
    { icon: "document-text-outline", label: "Add to Playing Queue" },
    { icon: "add-circle-outline", label: "Add to Playlist" },
    { icon: "person-outline", label: "Go to Artist" },
    { icon: "paper-plane-outline", label: "Share" },
  ];

  const handleAction = (label: string) => {
    if (label === "Download Offline") {
      downloadTrack(selectedSong);
      onClose();
    } else if (label === "Remove Download") {
      removeDownload(selectedSong.id);
      onClose();
    } else {
      console.log(label);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[styles.modalOverlay, { backgroundColor: isDark ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.1)" }]}>
          <TouchableWithoutFeedback>
            <View style={[styles.optionsModalContainer, { backgroundColor: colors.white }]}>
              <View style={[styles.dragIndicator, { backgroundColor: colors.border }]} />

              <View style={styles.optionsHeader}>
                <Image
                  source={{ uri: selectedSong.image || selectedSong.imageUrl }}
                  style={[styles.optionsImage, { backgroundColor: colors.lightGray }]}
                />
                <View style={styles.optionsInfo}>
                  <Text style={[styles.optionsTitle, { color: colors.text }]} numberOfLines={1}>
                    {selectedSong.title}
                  </Text>
                  <Text style={[styles.optionsSubtitle, { color: colors.gray }]} numberOfLines={1}>
                    {selectedSong.artist} | {selectedSong.duration}
                  </Text>
                </View>
                <TouchableOpacity>
                  <Ionicons
                    name="heart-outline"
                    size={24}
                    color={colors.text}
                  />
                </TouchableOpacity>
              </View>

              <View style={[styles.divider, { backgroundColor: colors.border }]} />

              <ScrollView
                contentContainerStyle={styles.optionsList}
                showsVerticalScrollIndicator={false}
              >
                {ACTIONS.map((action, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.actionItem}
                    onPress={() => handleAction(action.label)}
                  >
                    <Ionicons
                      name={action.icon as any}
                      size={24}
                      color={action.label === "Remove Download" ? colors.primary : colors.text}
                      style={styles.actionIcon}
                    />
                    <Text style={[styles.actionText, { color: action.label === "Remove Download" ? colors.primary : colors.text }]}>
                      {action.label}
                    </Text>
                  </TouchableOpacity>
                ))}
                <View style={{ height: 20 }} />
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
  },
  optionsModalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingVertical: 10,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: "80%",
    elevation: 20,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
    marginTop: 5,
  },
  optionsHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  optionsImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  optionsInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "center",
  },
  optionsTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  optionsSubtitle: {
    fontSize: 13,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    marginBottom: 10,
  },
  optionsList: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  actionIcon: {
    marginRight: 16,
  },
  actionText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
