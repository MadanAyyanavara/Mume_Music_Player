import { apiClient } from './client';
import { mapToTrack, mapToAlbum, mapToArtist, mapToPlaylist } from './mappers';
import { Track, Album, Artist, Playlist } from '@/types';

export const MusicService = {
    // Search
    searchGlobal: async (query: string) => {
        const data = await apiClient(`/search?query=${encodeURIComponent(query)}`);
        return data.data || { songs: [], albums: [], artists: [], playlists: [] };
    },

    searchSongs: async (query: string, page = 0, limit = 10): Promise<Track[]> => {
        try {
            const data = await apiClient(`/search/songs?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
            if (data.success === false) {
                console.warn(`API searchSongs failed for query "${query}":`, data.message);
                return [];
            }
            return (data.data?.results || []).map(mapToTrack);
        } catch (error) {
            console.error(`Error in searchSongs for query "${query}":`, error);
            return [];
        }
    },

    searchAlbums: async (query: string, page = 0, limit = 10): Promise<Album[]> => {
        try {
            const data = await apiClient(`/search/albums?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
            if (data.success === false) {
                console.warn(`API searchAlbums failed for query "${query}":`, data.message);
                return [];
            }
            return (data.data?.results || []).map(mapToAlbum);
        } catch (error) {
            console.error(`Error in searchAlbums for query "${query}":`, error);
            return [];
        }
    },

    searchArtists: async (query: string, page = 0, limit = 10): Promise<Artist[]> => {
        try {
            const data = await apiClient(`/search/artists?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
            if (data.success === false) {
                console.warn(`API searchArtists failed for query "${query}":`, data.message);
                return [];
            }
            return (data.data?.results || []).map(mapToArtist);
        } catch (error) {
            console.error(`Error in searchArtists for query "${query}":`, error);
            return [];
        }
    },

    searchPlaylists: async (query: string, page = 0, limit = 10): Promise<Playlist[]> => {
        try {
            const data = await apiClient(`/search/playlists?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
            if (data.success === false) {
                console.warn(`API searchPlaylists failed for query "${query}":`, data.message);
                return [];
            }
            return (data.data?.results || []).map(mapToPlaylist);
        } catch (error) {
            console.error(`Error in searchPlaylists for query "${query}":`, error);
            return [];
        }
    },

    // Songs
    getTrendingSongs: async (): Promise<Track[]> => {
        const trending = await MusicService.searchSongs('Trending');
        if (trending.length > 0) return trending;

        // Fallbacks
        const latest = await MusicService.searchSongs('Latest Hits');
        if (latest.length > 0) return latest;

        return MusicService.searchSongs('Top Charts');
    },

    getSongsByIds: async (ids: string): Promise<Track[]> => {
        try {
            const data = await apiClient(`/songs?ids=${encodeURIComponent(ids)}`);
            if (data.success === false) return [];
            return (data.data || []).map(mapToTrack);
        } catch (error) {
            console.error('Error in getSongsByIds:', error);
            return [];
        }
    },

    getSongByLink: async (link: string): Promise<Track | null> => {
        try {
            const data = await apiClient(`/songs?link=${encodeURIComponent(link)}`);
            if (data.success && data.data?.[0]) {
                return mapToTrack(data.data[0]);
            }
            return null;
        } catch (error) {
            console.error('Error in getSongByLink:', error);
            return null;
        }
    },

    getSongDetails: async (id: string, includeLyrics = false): Promise<Track | null> => {
        try {
            const lyricsQuery = includeLyrics ? '?lyrics=true' : '';
            const data = await apiClient(`/songs/${id}${lyricsQuery}`).catch(() => {
                const lyricsParam = includeLyrics ? '&lyrics=true' : '';
                return apiClient(`/songs?id=${id}${lyricsParam}`);
            });

            if (data.success && data.data?.[0]) {
                return mapToTrack(data.data[0]);
            }
            return null;
        } catch (error) {
            console.error(`Error in getSongDetails for id "${id}":`, error);
            return null;
        }
    },

    getSongSuggestions: async (id: string, limit = 10): Promise<Track[]> => {
        try {
            const data = await apiClient(`/songs/${id}/suggestions?limit=${limit}`).catch(() =>
                apiClient(`/songs?id=${id}&suggestions=${limit}`)
            );
            return (data.data || []).map(mapToTrack);
        } catch (error) {
            console.error(`Error in getSongSuggestions for id "${id}":`, error);
            return [];
        }
    },

    // Albums
    getAlbumDetails: async (id: string) => {
        try {
            let data = await apiClient(`/albums/${id}`).catch(() => apiClient(`/albums?id=${id}`));
            if (!data.success || !data.data) return null;

            const albumData = data.data;
            if (albumData && albumData.songs) {
                albumData.songs = albumData.songs.map(mapToTrack);
            }
            return albumData;
        } catch (error) {
            console.error(`Error in getAlbumDetails for id "${id}":`, error);
            return null;
        }
    },

    // Artists
    getArtistDetails: async (id: string, params: any = {}) => {
        try {
            const queryParams = new URLSearchParams();
            if (params.page !== undefined) queryParams.append('page', params.page.toString());
            if (params.songCount !== undefined) queryParams.append('songCount', params.songCount.toString());
            if (params.albumCount !== undefined) queryParams.append('albumCount', params.albumCount.toString());
            if (params.sortBy !== undefined) queryParams.append('sortBy', params.sortBy);
            if (params.sortOrder !== undefined) queryParams.append('sortOrder', params.sortOrder);

            const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
            let data = await apiClient(`/artists/${id}${queryString}`).catch(() => {
                const fallbackQuery = new URLSearchParams(queryParams);
                fallbackQuery.append('id', id);
                return apiClient(`/artists?${fallbackQuery.toString()}`);
            });

            return (data.success && data.data) ? mapToArtist(data.data) : null;
        } catch (error) {
            console.error(`Error in getArtistDetails for id "${id}":`, error);
            return null;
        }
    },

    getArtistSongs: async (id: string, page = 0, sortBy = 'popularity', sortOrder = 'desc'): Promise<Track[]> => {
        try {
            const data = await apiClient(`/artists/${id}/songs?page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}`).catch(() =>
                apiClient(`/artists?id=${id}&page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}`)
            );
            return (data.data?.results || data.data?.songs || []).map(mapToTrack);
        } catch (error) {
            console.error(`Error in getArtistSongs for id "${id}":`, error);
            return [];
        }
    },

    getArtistAlbums: async (id: string, page = 0, sortBy = 'latest', sortOrder = 'desc') => {
        try {
            const data = await apiClient(`/artists/${id}/albums?page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}`).catch(() =>
                apiClient(`/artists?id=${id}&page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}`)
            );
            return (data.data?.results || data.data?.albums || []).map(mapToAlbum);
        } catch (error) {
            console.error(`Error in getArtistAlbums for id "${id}":`, error);
            return [];
        }
    },

    // Playlists
    getPlaylistDetails: async (id: string, page = 0, limit = 10) => {
        try {
            let data = await apiClient(`/playlists/${id}?page=${page}&limit=${limit}`).catch(() =>
                apiClient(`/playlists?id=${id}&page=${page}&limit=${limit}`)
            );
            if (!data.success || !data.data) return null;

            const playlistData = data.data;
            if (playlistData && playlistData.songs) {
                playlistData.songs = playlistData.songs.map(mapToTrack);
            }
            return playlistData;
        } catch (error) {
            console.error(`Error in getPlaylistDetails for id "${id}":`, error);
            return null;
        }
    },
};
