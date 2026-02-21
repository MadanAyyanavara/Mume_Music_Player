import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
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
  const { colors, isDark } = useTheme();
  return (
    <TouchableOpacity
      style={[
        styles.settingItem,
        {
          backgroundColor: colors.card,
          borderColor: isDark ? colors.border : "transparent"
        }
      ]}
      onPress={type !== "toggle" ? onPress : undefined}
      disabled={type === "toggle"}
      activeOpacity={0.7}
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
            trackColor={{ false: isDark ? "#4A4A4A" : "#D1D1D6", true: colors.primary + "80" }}
            thumbColor={(value as boolean) ? colors.primary : "#F4F3F4"}
            ios_backgroundColor={isDark ? "#4A4A4A" : "#D1D1D6"}
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
  const [isQualityModalVisible, setQualityModalVisible] = useState(false);
  const [isAboutModalVisible, setAboutModalVisible] = useState(false);

  const [isProfileModalVisible, setProfileModalVisible] = useState(false);
  const [userName, setUserName] = useState("Madan Ayyanavara");
  const [userEmail, setUserEmail] = useState("madan@example.com");
  const [tempName, setTempName] = useState(userName);
  const [tempEmail, setTempEmail] = useState(userEmail);

  // Call this when opening the profile modal to reset temp state
  const handleOpenProfile = () => {
    setTempName(userName);
    setTempEmail(userEmail);
    setProfileModalVisible(true);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <TouchableOpacity
          style={[styles.profileSection, { backgroundColor: colors.white }]}
          activeOpacity={0.8}
          onPress={handleOpenProfile}
        >
          <Image
            source={{ uri: "https://i.pravatar.cc/150?u=mume" }}
            style={[styles.profileImage, { backgroundColor: colors.lightGray }]}
          />
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.text }]} numberOfLines={1}>{userName}</Text>
            <Text style={[styles.profileEmail, { color: colors.secondaryText }]} numberOfLines={1}>{userEmail}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>General Settings</Text>
          <SettingItem
            icon="person-outline"
            title="Profile"
            subtitle="Manage your profile information"
            onPress={handleOpenProfile}
          />
          <SettingItem
            icon={theme === 'dark' ? "moon" : "sunny"}
            title="Dark Mode"
            subtitle="Switch between light and dark themes"
            value={theme === 'dark'}
            type="toggle"
            onPress={toggleTheme}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Audio & Playback</Text>
          <SettingItem
            icon="musical-note-outline"
            title="Sound Quality"
            subtitle="Choose your preferred audio quality"
            value={quality}
            type="select"
            onPress={() => setQualityModalVisible(true)}
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
          <SettingItem icon="information-circle-outline" title="About Mume" onPress={() => setAboutModalVisible(true)} />
          <SettingItem icon="help-circle-outline" title="Help & Support" />
          <SettingItem icon="document-text-outline" title="Privacy Policy" />
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, { borderColor: isDark ? "#FF3B3040" : "#FF3B3020", backgroundColor: isDark ? "#FF3B3010" : "#FF3B3005" }]}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.gray }]}>Version 1.0.0</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Quality Selection Modal */}
      <Modal
        visible={isQualityModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setQualityModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setQualityModalVisible(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Sound Quality</Text>
              <TouchableOpacity onPress={() => setQualityModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <View style={{ height: 16 }} />
            {["Low", "Medium", "High", "Ultra"].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.modalOption,
                  quality === option && { backgroundColor: colors.primary + "15" }
                ]}
                onPress={() => {
                  setQuality(option);
                  setQualityModalVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    { color: colors.text },
                    quality === option && { color: colors.primary, fontWeight: "700" }
                  ]}
                >
                  {option}
                </Text>
                {quality === option && (
                  <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* About App Modal */}
      <Modal
        visible={isAboutModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setAboutModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlayCentered}
          activeOpacity={1}
          onPress={() => setAboutModalVisible(false)}
        >
          <View style={[styles.aboutModalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.aboutLogoContainer, { backgroundColor: colors.primary + "15" }]}>
              <Ionicons name="musical-notes" size={40} color={colors.primary} />
            </View>
            <Text style={[styles.aboutTitle, { color: colors.text }]}>Mume</Text>
            <Text style={[styles.aboutVersion, { color: colors.primary }]}>Version 1.0.0</Text>

            <View style={[styles.aboutDivider, { backgroundColor: colors.border }]} />

            <Text style={[styles.aboutDescription, { color: colors.secondaryText }]}>
              A premium, dynamic music experience designed to deliver high-fidelity audio with seamless, fluid interfaces.
            </Text>

            <View style={[styles.aboutAuthorContainer, { backgroundColor: colors.background }]}>
              <Ionicons name="person-circle" size={48} color={colors.gray} />
              <View style={styles.aboutAuthorTextContainer}>
                <Text style={[styles.aboutAuthorLabel, { color: colors.gray }]}>Developed by</Text>
                <Text style={[styles.aboutAuthorName, { color: colors.text }]}>Madan Ayyanavara</Text>
              </View>
            </View>

            <Text style={[styles.aboutCopyright, { color: colors.gray }]}>
              © 2026 Madan Ayyanavara.{"\n"}All rights reserved.
            </Text>

            <TouchableOpacity
              style={[styles.aboutCloseBtn, { backgroundColor: colors.primary }]}
              onPress={() => setAboutModalVisible(false)}
            >
              <Text style={styles.aboutCloseBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal
        visible={isProfileModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.profileModalWrapper}>
            <View style={[styles.profileModalContent, { backgroundColor: colors.background }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Profile</Text>
                <TouchableOpacity onPress={() => setProfileModalVisible(false)}>
                  <Ionicons name="close" size={24} color={colors.gray} />
                </TouchableOpacity>
              </View>

              <View style={styles.profileImageEditContainer}>
                <Image
                  source={{ uri: "https://i.pravatar.cc/150?u=mume" }}
                  style={[styles.profileImageLarge, { backgroundColor: colors.lightGray }]}
                />
                <TouchableOpacity style={[styles.cameraBadge, { backgroundColor: colors.primary }]}>
                  <Ionicons name="camera" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.secondaryText }]}>Full Name</Text>
                <TextInput
                  style={[styles.input, { color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]}
                  value={tempName}
                  onChangeText={setTempName}
                  placeholder="Enter your name"
                  placeholderTextColor={colors.gray}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.secondaryText }]}>Email Address</Text>
                <TextInput
                  style={[styles.input, { color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]}
                  value={tempEmail}
                  onChangeText={setTempEmail}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.gray}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity
                style={[styles.saveProfileBtn, { backgroundColor: colors.primary }]}
                onPress={() => {
                  setUserName(tempName);
                  setUserEmail(tempEmail);
                  setProfileModalVisible(false);
                }}
              >
                <Text style={styles.saveProfileBtnText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

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
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
  },
  settingIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    borderRadius: 24,
    borderWidth: 1,
    shadowColor: "#FF3B30",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
  },
  modalOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 8,
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlayCentered: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  aboutModalContent: {
    width: "100%",
    borderRadius: 32,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
    borderWidth: 1,
  },
  aboutLogoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  aboutTitle: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 4,
  },
  aboutVersion: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 24,
  },
  aboutDivider: {
    width: "100%",
    height: 1,
    marginBottom: 24,
  },
  aboutDescription: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 32,
  },
  aboutAuthorContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    width: "100%",
    marginBottom: 24,
  },
  aboutAuthorTextContainer: {
    marginLeft: 12,
  },
  aboutAuthorLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  aboutAuthorName: {
    fontSize: 18,
    fontWeight: "700",
  },
  aboutCopyright: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 32,
  },
  aboutCloseBtn: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  aboutCloseBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  profileModalWrapper: {
    width: "100%",
    justifyContent: "flex-end",
  },
  profileModalContent: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  profileImageEditContainer: {
    alignSelf: "center",
    marginTop: 16,
    marginBottom: 32,
    position: "relative",
  },
  profileImageLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 20,
    fontSize: 16,
    fontWeight: "500",
  },
  saveProfileBtn: {
    marginTop: 12,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF8800",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  saveProfileBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
