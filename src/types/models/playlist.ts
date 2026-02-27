export interface Playlist {
    id: string;
    name: string;
    imageUrl: string;
    type: 'playlist';
    songCount?: number;
    language?: string;
    url?: string;
}
