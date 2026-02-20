import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TabNavigator } from "./TabNavigator";
import PlayerScreen from "../screens/PlayerScreen";

import { ArtistDetailsScreen } from "../screens/ArtistDetailsScreen";
import { AlbumDetailsScreen } from "../screens/AlbumDetailsScreen";
import { SearchScreen } from "../screens/SearchScreen";
import { FolderDetailsScreen } from "../screens/FolderDetailsScreen";

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator id="root-stack" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen
          name="Player"
          component={PlayerScreen}
          options={{ presentation: "modal" }}
        />
        <Stack.Screen name="ArtistDetails" component={ArtistDetailsScreen} />
        <Stack.Screen name="AlbumDetails" component={AlbumDetailsScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="FolderDetails" component={FolderDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
