import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";
import { usePlayerStore } from "../store/usePlayerStore";

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  value?: string | boolean;
  onPress?: () => void;
  type?: "toggle" | "select" | "link";
}

const SettingItem = ({
  icon,
  title,
  subtitle,
  value,
  onPress,
  type = "link",
}: SettingItemProps) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={[styles.settingItem, { backgroundColor: colors.white }]}
      onPress={type !== "toggle" ? onPress : undefined}
      disabled={type === "toggle"}
    >
      <View style={[styles.settingIconContainer, { backgroundColor: colors.primary + "15" }]}>
        <Ionicons name={icon} size={24} color={colors.primary} />
      </View>
      <View style={styles.settingTextContainer}>
        <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
        {subtitle && <Text style={[styles.settingSubtitle, { color: colors.secondaryText }]}>{subtitle}</Text>}
      </View>
      <View style={styles.settingValueContainer}>
        {type === "toggle" ? (
          <Switch
            value={value as boolean}
            onValueChange={onPress as any}
            trackColor={{ false: colors.lightGray, true: colors.primary + "80" }}
            thumbColor={(value as boolean) ? colors.primary : colors.white}
          />
        ) : type === "select" ? (
          <View style={styles.selectValueContainer}>
            <Text style={[styles.settingValueText, { color: colors.primary }]}>{value}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.gray} />
          </View>
        ) : (
          <Ionicons name="chevron-forward" size={20} color={colors.gray} />
        )}
      </View>
    </TouchableOpacity>
  );
};

export const SettingsScreen = () => {
  const [autoplay, setAutoplay] = useState(true);
  const { theme, toggleTheme, favorites } = usePlayerStore();
  const { colors, isDark } = useTheme();
  const [quality, setQuality] = useState("High");

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <TouchableOpacity style={[styles.profileSection, { backgroundColor: colors.white }]}>
          <Image
            source={{ uri: "https://i.pravatar.cc/150?u=mume" }}
            style={[styles.profileImage, { backgroundColor: colors.lightGray }]}
          />
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.text }]}>Madan Ayyanavara</Text>
            <Text style={[styles.profileEmail, { color: colors.secondaryText }]}>madan@example.com</Text>
          </View>
          <TouchableOpacity style={[styles.editButton, { backgroundColor: colors.primary + "15" }]}>
            <Ionicons name="pencil" size={20} color={colors.primary} />
          </TouchableOpacity>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>General Settings</Text>
          <SettingItem
            icon="person-outline"
            title="Profile"
            subtitle="Manage your profile information"
            onPress={() => { }}
          />
          <SettingItem
            icon="color-palette-outline"
            title="Theme"
            value={theme === 'dark' ? "Dark Mode" : "Light Mode"}
            type="select"
            onPress={toggleTheme}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Audio & Playback</Text>
          <SettingItem
            icon="musical-note-outline"
            title="Sound Quality"
            value={quality}
            type="select"
            onPress={() => {
              const options = ["Low", "Medium", "High", "Ultra"];
              const currentIndex = options.indexOf(quality);
              const nextIndex = (currentIndex + 1) % options.length;
              setQuality(options[nextIndex]);
            }}
          />
          <SettingItem
            icon="play-circle-outline"
            title="Autoplay"
            subtitle="Automatically play next song"
            value={autoplay}
            type="toggle"
            onPress={() => setAutoplay(!autoplay)}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>App Info</Text>
          <SettingItem icon="information-circle-outline" title="About Mume" />
          <SettingItem icon="help-circle-outline" title="Help & Support" />
          <SettingItem icon="document-text-outline" title="Privacy Policy" />
        </View>

        <TouchableOpacity style={[styles.logoutButton, { borderColor: isDark ? "#FF3B3040" : "#FF3B3020" }]}>
          <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.gray }]}>Version 1.0.0</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
    marginHorizontal: 20,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 24,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F0F0F0",
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontWeight: "500",
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    marginLeft: 4,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 8,
  },
  settingIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  settingTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  settingSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  settingValueContainer: {
    marginLeft: 8,
  },
  selectValueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingValueText: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 4,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 24,
    marginTop: 12,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF3B30",
    marginLeft: 8,
  },
  footer: {
    alignItems: "center",
    marginTop: 32,
    marginBottom: 24,
  },
  footerText: {
    fontSize: 13,
    fontWeight: "500",
  },
});
