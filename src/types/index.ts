import { ImageSourcePropType } from "react-native";

export type User = {
  id: string;
  name: string;
  image: ImageSourcePropType;
};

export type Song = {
  id: string;
  title: string;
  artist: string;
  image: ImageSourcePropType;
};

export type Album = {
  id: string;
  title: string;
  artist: string;
  image: ImageSourcePropType;
};
