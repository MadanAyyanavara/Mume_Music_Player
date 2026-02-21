import { Track } from "../store/usePlayerStore";

const BASE_URL = 'https://jiosaavn-api-murex.vercel.app/api';

const mapToTrack = (song: any): Track => {
    // Determine image URL
    let imageUrl = '';
    if (Array.isArray(song.image)) {
        imageUrl = song.image[2]?.url || song.image[2]?.link || song.image[1]?.url || song.image[1]?.link || '';
    } else {
        imageUrl = song.image || '';
    }

    // Determine audio URL
    let audioUrl = '';
    if (Array.isArray(song.downloadUrl)) {
        audioUrl = song.downloadUrl[4]?.url || song.downloadUrl[4]?.link || song.downloadUrl[3]?.url || song.downloadUrl[3]?.link || '';
    }

    // Determine artist name
    let artistName = 'Unknown Artist';
    if (song.artists?.primary && Array.isArray(song.artists.primary)) {
        artistName = song.artists.primary.map((a: any) => a.name).join(', ');
    } else if (song.primaryArtists) {
        artistName = song.primaryArtists;
    } else if (song.artist) {
        artistName = song.artist;
    } else if (song.singers) {
        artistName = song.singers;
    }

    return {
        id: song.id,
        title: song.name || song.title || 'Unknown Title',
        artist: artistName,
        imageUrl: imageUrl,
        audioUrl: audioUrl,
        duration: Number(song.duration) || 0,
        lyrics: song.lyrics?.lyrics // If lyrics are included in the search/details object
    };
};

const mapToAlbum = (album: any) => {
    let imageUrl = '';
    if (Array.isArray(album.image)) {
        imageUrl = album.image[2]?.url || album.image[2]?.link || album.image[1]?.url || album.image[1]?.link || '';
    } else {
        imageUrl = album.image || '';
    }

    let artistName = 'Unknown Artist';
    if (album.artists?.primary && Array.isArray(album.artists.primary)) {
        artistName = album.artists.primary.map((a: any) => a.name).join(', ');
    } else if (album.artist) {
        artistName = album.artist;
    }

    return {
        id: album.id,
        name: album.name || album.title,
        artist: artistName,
        imageUrl: imageUrl,
        type: 'album',
        year: album.year,
        description: album.description,
        url: album.url,
        songCount: album.songCount
    };
};

const mapToArtist = (artist: any) => {
    let imageUrl = '';
    if (Array.isArray(artist.image)) {
        imageUrl = artist.image[2]?.url || artist.image[2]?.link || artist.image[1]?.url || artist.image[1]?.link || '';
    } else {
        imageUrl = artist.image || '';
    }

    return {
        id: artist.id,
        name: artist.name || artist.title,
        imageUrl: imageUrl,
        role: artist.role,
        type: 'artist',
        url: artist.url,
        followerCount: artist.followerCount,
        fanCount: artist.fanCount,
        isVerified: artist.isVerified,
        dominantLanguage: artist.dominantLanguage,
        bio: artist.bio?.[0]?.text,
        topSongs: (artist.topSongs || []).map(mapToTrack),
        topAlbums: (artist.topAlbums || []).map(mapToAlbum),
        singles: (artist.singles || []).map(mapToTrack),
        similarArtists: (artist.similarArtists || []).map((a: any) => {
            let simImg = '';
            if (Array.isArray(a.image)) {
                simImg = a.image[2]?.url || a.image[2]?.link || a.image[1]?.url || a.image[1]?.link || '';
            } else {
                simImg = a.image || '';
            }
            return {
                id: a.id,
                name: a.name,
                imageUrl: simImg,
                url: a.url,
                type: a.type
            };
        })
    };
};

const mapToPlaylist = (playlist: any) => {
    let imageUrl = '';
    if (Array.isArray(playlist.image)) {
        imageUrl = playlist.image[2]?.url || playlist.image[2]?.link || playlist.image[1]?.url || playlist.image[1]?.link || '';
    } else {
        imageUrl = playlist.image || '';
    }

    return {
        id: playlist.id,
        name: playlist.name || playlist.title,
        imageUrl: imageUrl,
        type: 'playlist',
        songCount: playlist.songCount,
        language: playlist.language,
        url: playlist.url
    };
};

export const fetchGlobalSearch = async (query: string) => {
    try {
        const response = await fetch(`${BASE_URL}/search?query=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text();
            console.error('Expected JSON but got:', text.substring(0, 100));
            throw new Error("Received non-JSON response from server");
        }
        const data = await response.json();
        return data.data || { songs: [], albums: [], artists: [], playlists: [] };
    } catch (error) {
        console.error('Error in global search:', error);
        return { songs: [], albums: [], artists: [], playlists: [] };
    }
};

export const fetchSongs = async (query: string, page = 0, limit = 10): Promise<Track[]> => {
    try {
        const response = await fetch(`${BASE_URL}/search/songs?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Received non-JSON response from server");
        }
        const data = await response.json();
        return (data.data.results || []).map(mapToTrack);
    } catch (error) {
        console.error('Error fetching songs:', error);
        return [];
    }
};

export const fetchAlbums = async (query: string, page = 0, limit = 10) => {
    try {
        const response = await fetch(`${BASE_URL}/search/albums?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return (data.data.results || []).map(mapToAlbum);
    } catch (error) {
        console.error('Error fetching albums:', error);
        return [];
    }
};

export const fetchArtists = async (query: string, page = 0, limit = 10) => {
    try {
        const response = await fetch(`${BASE_URL}/search/artists?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return (data.data.results || []).map(mapToArtist);
    } catch (error) {
        console.error('Error fetching artists:', error);
        return [];
    }
};

export const fetchPlaylists = async (query: string, page = 0, limit = 10) => {
    try {
        const response = await fetch(`${BASE_URL}/search/playlists?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return (data.data.results || []).map(mapToPlaylist);
    } catch (error) {
        console.error('Error fetching playlists:', error);
        return [];
    }
};

export const fetchTrendingSongs = async (): Promise<Track[]> => {
    return fetchSongs('Trending');
};

export const fetchSongsByIds = async (ids: string): Promise<Track[]> => {
    try {
        const response = await fetch(`${BASE_URL}/songs?ids=${encodeURIComponent(ids)}`);
        const data = await response.json();
        return (data.data || []).map(mapToTrack);
    } catch (error) {
        console.error('Error fetching songs by ids:', error);
        return [];
    }
};

export const fetchSongByLink = async (link: string): Promise<Track | null> => {
    try {
        const response = await fetch(`${BASE_URL}/songs?link=${encodeURIComponent(link)}`);
        const data = await response.json();
        return data.data?.[0] ? mapToTrack(data.data[0]) : null;
    } catch (error) {
        console.error('Error fetching song by link:', error);
        return null;
    }
};

export const fetchSongDetails = async (id: string, includeLyrics = false): Promise<Track | null> => {
    try {
        const lyricsQuery = includeLyrics ? '?lyrics=true' : '';
        // Support both ?id= and /{id} styles
        const response = await fetch(`${BASE_URL}/songs/${id}${lyricsQuery}`);
        const data = await response.json();
        return data.data?.[0] ? mapToTrack(data.data[0]) : null;
    } catch (error) {
        console.error('Error fetching song details:', error);
        // Fallback to query param version
        try {
            const lyricsParam = includeLyrics ? '&lyrics=true' : '';
            const response = await fetch(`${BASE_URL}/songs?id=${id}${lyricsParam}`);
            const data = await response.json();
            return data.data?.[0] ? mapToTrack(data.data[0]) : null;
        } catch (e) {
            return null;
        }
    }
};

export const fetchSongSuggestions = async (id: string, limit = 10): Promise<Track[]> => {
    try {
        const response = await fetch(`${BASE_URL}/songs/${id}/suggestions?limit=${limit}`);
        const data = await response.json();
        return (data.data || []).map(mapToTrack);
    } catch (error) {
        console.error('Error fetching song suggestions:', error);
        return [];
    }
};

export const fetchAlbumDetails = async (id: string) => {
    try {
        // Support both path and query param
        let response = await fetch(`${BASE_URL}/albums/${id}`);
        let data = await response.json();

        if (!data.success) {
            response = await fetch(`${BASE_URL}/albums?id=${id}`);
            data = await response.json();
        }

        const albumData = data.data;
        if (albumData && albumData.songs) {
            albumData.songs = albumData.songs.map(mapToTrack);
        }
        return albumData;
    } catch (error) {
        console.error('Error fetching album details:', error);
        return null;
    }
};

export const fetchAlbumsByIds = async (ids: string) => {
    try {
        const response = await fetch(`${BASE_URL}/albums?ids=${encodeURIComponent(ids)}`);
        const data = await response.json();
        return (data.data || []).map(mapToAlbum);
    } catch (error) {
        console.error('Error fetching albums by ids:', error);
        return [];
    }
};

export const fetchAlbumByLink = async (link: string) => {
    try {
        const response = await fetch(`${BASE_URL}/albums?link=${encodeURIComponent(link)}`);
        const data = await response.json();
        const albumData = data.data;
        if (albumData && albumData.songs) {
            albumData.songs = albumData.songs.map(mapToTrack);
        }
        return albumData;
    } catch (error) {
        console.error('Error fetching album by link:', error);
        return null;
    }
};

export const fetchPlaylistDetails = async (id: string, page = 0, limit = 10) => {
    try {
        // Support both path and query param
        let response = await fetch(`${BASE_URL}/playlists/${id}?page=${page}&limit=${limit}`);
        let data = await response.json();

        if (!data.success) {
            response = await fetch(`${BASE_URL}/playlists?id=${id}&page=${page}&limit=${limit}`);
            data = await response.json();
        }

        const playlistData = data.data;
        if (playlistData && playlistData.songs) {
            playlistData.songs = playlistData.songs.map(mapToTrack);
        }
        return playlistData;
    } catch (error) {
        console.error('Error fetching playlist details:', error);
        return null;
    }
};

export const fetchPlaylistsByIds = async (ids: string) => {
    try {
        const response = await fetch(`${BASE_URL}/playlists?ids=${encodeURIComponent(ids)}`);
        const data = await response.json();
        return (data.data || []).map(mapToPlaylist);
    } catch (error) {
        console.error('Error fetching playlists by ids:', error);
        return [];
    }
};

export const fetchPlaylistByLink = async (link: string, page = 0, limit = 10) => {
    try {
        const response = await fetch(`${BASE_URL}/playlists?link=${encodeURIComponent(link)}&page=${page}&limit=${limit}`);
        const data = await response.json();
        const playlistData = data.data;
        if (playlistData && playlistData.songs) {
            playlistData.songs = playlistData.songs.map(mapToTrack);
        }
        return playlistData;
    } catch (error) {
        console.error('Error fetching playlist by link:', error);
        return null;
    }
};

export const fetchArtistDetails = async (id: string, params: any = {}) => {
    try {
        const queryParams = new URLSearchParams();
        if (params.page !== undefined) queryParams.append('page', params.page.toString());
        if (params.songCount !== undefined) queryParams.append('songCount', params.songCount.toString());
        if (params.albumCount !== undefined) queryParams.append('albumCount', params.albumCount.toString());
        if (params.sortBy !== undefined) queryParams.append('sortBy', params.sortBy);
        if (params.sortOrder !== undefined) queryParams.append('sortOrder', params.sortOrder);

        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

        let response = await fetch(`${BASE_URL}/artists/${id}${queryString}`);
        let data = await response.json();

        if (!data.success) {
            // Fallback to query param id
            const fallbackQuery = new URLSearchParams(queryParams);
            fallbackQuery.append('id', id);
            response = await fetch(`${BASE_URL}/artists?${fallbackQuery.toString()}`);
            data = await response.json();
        }

        return data.data ? mapToArtist(data.data) : null;
    } catch (error) {
        console.error('Error fetching artist details:', error);
        return null;
    }
};

export const fetchArtistByLink = async (link: string, params: any = {}) => {
    try {
        const queryParams = new URLSearchParams();
        queryParams.append('link', link);
        if (params.page !== undefined) queryParams.append('page', params.page.toString());
        if (params.songCount !== undefined) queryParams.append('songCount', params.songCount.toString());
        if (params.albumCount !== undefined) queryParams.append('albumCount', params.albumCount.toString());
        if (params.sortBy !== undefined) queryParams.append('sortBy', params.sortBy);
        if (params.sortOrder !== undefined) queryParams.append('sortOrder', params.sortOrder);

        const response = await fetch(`${BASE_URL}/artists?${queryParams.toString()}`);
        const data = await response.json();
        return data.data ? mapToArtist(data.data) : null;
    } catch (error) {
        console.error('Error fetching artist by link:', error);
        return null;
    }
};

export const fetchArtistSongs = async (id: string, page = 0, sortBy = 'popularity', sortOrder = 'desc') => {
    try {
        const response = await fetch(`${BASE_URL}/artists/${id}/songs?page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
        const data = await response.json();
        const songs = data.data.songs || data.data.results || [];
        return songs.map(mapToTrack);
    } catch (error) {
        console.error('Error fetching artist songs:', error);
        return [];
    }
};

export const fetchArtistAlbums = async (id: string, page = 0, sortBy = 'popularity', sortOrder = 'desc') => {
    try {
        const response = await fetch(`${BASE_URL}/artists/${id}/albums?page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
        const data = await response.json();
        const albums = data.data.albums || data.data.results || [];
        return albums.map(mapToAlbum);
    } catch (error) {
        console.error('Error fetching artist albums:', error);
        return [];
    }
};
