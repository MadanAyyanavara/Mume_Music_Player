export interface Track {
    id: string;
    title: string;
    artist: string;
    imageUrl: string;
    audioUrl: string;
    localAudioUrl?: string;
    duration: number; // in seconds
    lyrics?: string;
}
