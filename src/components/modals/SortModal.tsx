import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";

const SORT_OPTIONS = [
  "Ascending",
  "Descending",
  "Artist",
  "Album",
  "Year",
  "Date Added",
  "Date Modified",
  "Composer",
];

interface SortModalProps {
  visible: boolean;
  onClose: () => void;
  onSort: (option: string) => void;
  sortBy: string;
}

export const SortModal = ({
  visible,
  onClose,
  onSort,
  sortBy,
}: SortModalProps) => {
  const { colors, isDark } = useTheme();
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[styles.modalOverlay, { backgroundColor: isDark ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.1)" }]}>
          <View style={[styles.sortMenuContainer, { backgroundColor: colors.white }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {SORT_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.sortOption}
                  onPress={() => onSort(option)}
                >
                  <Text style={[styles.sortOptionText, { color: colors.text }]}>{option}</Text>
                  <View
                    style={[
                      styles.radioButton,
                      { borderColor: colors.border },
                      sortBy === option && { borderColor: colors.primary },
                    ]}
                  >
                    {sortBy === option && (
                      <View style={[styles.radioButtonInner, { backgroundColor: colors.primary }]} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
  },
  sortMenuContainer: {
    width: 200,
    borderRadius: 12,
    paddingVertical: 10,
    maxHeight: 400,
    position: "absolute",
    top: 180,
    right: 24,
    elevation: 10,
  },
  sortOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  sortOptionText: {
    fontSize: 16,
    fontWeight: "500",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonSelected: {},
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
