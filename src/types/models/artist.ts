import { Track } from './track';
import { Album } from './album';

export interface Artist {
    id: string;
    name: string;
    imageUrl: string;
    role?: string;
    type: 'artist';
    url?: string;
    followerCount?: string;
    fanCount?: string;
    isVerified?: boolean;
    dominantLanguage?: string;
    bio?: string;
    topSongs?: Track[];
    topAlbums?: Album[];
    singles?: Track[];
    similarArtists?: {
        id: string;
        name: string;
        imageUrl: string;
        url: string;
        type: string;
    }[];
}
