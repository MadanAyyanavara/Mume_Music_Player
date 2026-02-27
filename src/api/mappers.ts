import { Track, Album, Artist, Playlist } from '@/types';

export const mapToTrack = (song: any): Track => {
    let imageUrl = '';
    if (Array.isArray(song.image)) {
        imageUrl = song.image[2]?.url || song.image[2]?.link || song.image[1]?.url || song.image[1]?.link || '';
    } else {
        imageUrl = song.image || '';
    }

    let audioUrl = '';
    if (Array.isArray(song.downloadUrl)) {
        audioUrl = song.downloadUrl[4]?.url || song.downloadUrl[4]?.link || song.downloadUrl[3]?.url || song.downloadUrl[3]?.link || '';
    }

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
        lyrics: song.lyrics?.lyrics
    };
};

export const mapToAlbum = (album: any): Album => {
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

export const mapToArtist = (artist: any): Artist => {
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

export const mapToPlaylist = (playlist: any): Playlist => {
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
