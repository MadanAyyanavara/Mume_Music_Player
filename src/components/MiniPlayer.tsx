import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { usePlayerStore } from "../store/usePlayerStore";
import { useTheme } from "../hooks/useTheme";

const { width } = Dimensions.get("window");

export const MiniPlayer = () => {
    const navigation = useNavigation<any>();
    const { currentTrack, isPlaying, pause, resume, next, position, duration, isLoading, playbackSessionId } = usePlayerStore();
    const { colors, isDark } = useTheme();

    if (!currentTrack) return null;

    // Derived progress should be 0 if loading or if position is 0
    const progress = (duration > 0 && !isLoading) ? (position / duration) * 100 : 0;

    return (
        <View style={styles.outerContainer}>
            <TouchableOpacity
                key={playbackSessionId}
                style={[styles.miniPlayer, { backgroundColor: colors.white, borderColor: colors.border }]}
                activeOpacity={0.95}
                onPress={() => navigation.navigate("Player")}
            >
                {/* Progress Bar Top */}
                <View style={[styles.progressBarContainer, { backgroundColor: colors.lightGray }]}>
                    <View style={[styles.progressBar, { width: `${progress}%`, backgroundColor: colors.primary }]} />
                </View>

                <Image
                    source={{ uri: currentTrack.imageUrl }}
                    style={[styles.miniPlayerImage, { backgroundColor: colors.lightGray }]}
                />
                <View style={styles.miniPlayerInfo}>
                    <Text style={[styles.miniPlayerTitle, { color: colors.text }]} numberOfLines={1}>
                        {currentTrack.title}
                    </Text>
                    <Text style={[styles.miniPlayerSubtitle, { color: colors.primary }]} numberOfLines={1}>
                        {currentTrack.artist}
                    </Text>
                </View>
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.playBtn}
                        onPress={(e) => {
                            isPlaying ? pause() : resume();
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color={colors.primary} size="small" />
                        ) : (
                            <Ionicons
                                name={isPlaying ? "pause" : "play"}
                                size={24}
                                color={colors.primary}
                            />
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.nextBtn}
                        onPress={(e) => {
                            next();
                        }}
                    >
                        <Ionicons name="play-skip-forward" size={24} color={colors.gray} />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "transparent",
        paddingHorizontal: 12,
        paddingBottom: 8,
    },
    miniPlayer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    progressBarContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
    },
    progressBar: {
        height: '100%',
    },
    miniPlayerImage: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: "#F0F0F0",
    },
    miniPlayerInfo: {
        flex: 1,
        marginLeft: 14,
        justifyContent: "center",
    },
    miniPlayerTitle: {
        fontSize: 15,
        fontWeight: "700",
        marginBottom: 2,
    },
    miniPlayerSubtitle: {
        fontSize: 12,
        fontWeight: "600",
    },
    actions: {
        flexDirection: "row",
        alignItems: "center",
    },
    playBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nextBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 4,
    },
});
