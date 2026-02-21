import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../hooks/useTheme";

interface SectionHeaderProps {
  title: string;
  onSeeAll?: () => void;
}

export const SectionHeader = ({ title, onSeeAll }: SectionHeaderProps) => {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 20,
    marginTop: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "600",
  },
});
