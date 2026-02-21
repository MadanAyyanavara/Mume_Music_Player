import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from "../screens/HomeScreen";
import { FavoritesScreen } from "../screens/FavoritesScreen";
import { PlaylistsScreen } from "../screens/PlaylistsScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";
import { usePlayerStore } from "../store/usePlayerStore";

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  const { colors, theme } = useTheme();
  const setHomeActiveTab = usePlayerStore((state) => state.setHomeActiveTab);
  const homeActiveTab = usePlayerStore((state) => state.homeActiveTab);
  return (
    <Tab.Navigator
      id="main-tabs"
      key={theme} // Force re-render on theme change
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          marginTop: -4,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Favorites") {
            iconName = focused ? "heart" : "heart-outline";
          } else if (route.name === "Playlists") {
            // Using document-text to match the document-like icon in the PNG
            iconName = focused ? "document-text" : "document-text-outline";
          } else {
            iconName = focused ? "settings" : "settings-outline";
          }

          return <Ionicons name={iconName} size={28} color={color} />; // Enforce size 28 for all icons
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Reset home tab state when home tab is pressed
            setHomeActiveTab("Suggested");

            // Also pop any detailed screens in the root navigator if we are in Main stack
            // by navigating specifically to the Home screen within Main
            navigation.navigate("Home");
          },
        })}
      />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Playlists" component={PlaylistsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};
