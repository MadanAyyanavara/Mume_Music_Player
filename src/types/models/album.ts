import { Track } from './track';

export interface Album {
    id: string;
    name: string;
    artist: string;
    imageUrl: string;
    type: 'album';
    year?: string;
    description?: string;
    url?: string;
    songCount?: number;
    songs?: Track[];
}
