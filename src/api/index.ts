export * from './music.service';
export * from './client';
export * from './mappers';

import { MusicService } from './music.service';

export const fetchGlobalSearch = MusicService.searchGlobal;
export const fetchSongs = MusicService.searchSongs;
export const fetchAlbums = MusicService.searchAlbums;
export const fetchArtists = MusicService.searchArtists;
export const fetchPlaylists = MusicService.searchPlaylists;
export const fetchTrendingSongs = MusicService.getTrendingSongs;
export const fetchSongsByIds = MusicService.getSongsByIds;
export const fetchSongByLink = MusicService.getSongByLink;
export const fetchSongDetails = MusicService.getSongDetails;
export const fetchSongSuggestions = MusicService.getSongSuggestions;
export const fetchAlbumDetails = MusicService.getAlbumDetails;
export const fetchArtistDetails = MusicService.getArtistDetails;
export const fetchArtistSongs = MusicService.getArtistSongs;
export const fetchArtistAlbums = MusicService.getArtistAlbums;
export const fetchPlaylistDetails = MusicService.getPlaylistDetails;
