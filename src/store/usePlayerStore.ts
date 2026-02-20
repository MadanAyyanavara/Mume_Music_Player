import { create } from 'zustand';
import { Audio, AVPlaybackStatus, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Track = {
  id: string;
  title: string;
  artist: string;
  imageUrl: string;
  audioUrl: string;
  duration: number; // in seconds
  lyrics?: string;
};

type PlayerState = {
  currentTrack: Track | null;
  queue: Track[];
  currentIndex: number;
  isPlaying: boolean;
  position: number;
  duration: number;
  favorites: Track[];

  // actions
  playTrack: (track: Track, queue?: Track[]) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  seekTo: (seconds: number) => Promise<void>;
  setQueue: (queue: Track[]) => void;
  next: () => Promise<void>;
  previous: () => Promise<void>;
  toggleFavorite: (track: Track) => void;
  isFavorite: (id: string) => boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  loadTheme: () => Promise<void>;
  homeActiveTab: string;
  setHomeActiveTab: (tab: string) => void;
  initializeAudio: () => Promise<void>;
  isLoading: boolean;
  playbackSessionId: number;
  // Queue methods
  addToQueue: (track: Track) => void;
  removeFromQueue: (id: string) => void;
  updateQueue: (newQueue: Track[]) => void;
  persistState: () => Promise<void>;
  loadPersistedState: () => Promise<void>;
};

let soundInstance: Audio.Sound | null = null;
let trackLoadRequestCounter = 0; // Global counter to track the latest request

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  queue: [],
  currentIndex: -1,
  isPlaying: false,
  position: 0,
  duration: 0,
  favorites: [],
  theme: 'light',
  homeActiveTab: 'Suggested',
  isLoading: false,
  playbackSessionId: 0,
  setHomeActiveTab: (tab: string) => set({ homeActiveTab: tab }),

  initializeAudio: async () => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
    });
  },

  playTrack: async (track: Track, queue?: Track[]) => {
    // 1. Increment request counter to invalidate any previous pending loads
    const currentRequestId = ++trackLoadRequestCounter;
    const newSessionId = get().playbackSessionId + 1;

    // 2. Immediate UI Reset & Detach old sound
    const newQueue = queue || get().queue;
    const index = newQueue.findIndex((t: Track) => t.id === track.id);

    // Detach and kill old sound INSTANTLY to prevent overlap
    const instanceToUnload = soundInstance;
    if (instanceToUnload) {
      instanceToUnload.setOnPlaybackStatusUpdate(null);
    }
    soundInstance = null; // Clear global ref immediately

    set({
      currentTrack: track,
      queue: newQueue,
      currentIndex: index !== -1 ? index : 0,
      isPlaying: false, // Don't show playing until it actually starts
      position: 0,
      duration: track.duration || 0,
      isLoading: true,
      playbackSessionId: newSessionId,
    });

    try {
      // 3. Perform cleanup of old instance asynchronously
      // We don't await this to keep the UI 'Rapid-Fire' responsive
      if (instanceToUnload) {
        instanceToUnload.stopAsync().then(() => instanceToUnload.unloadAsync()).catch(() => { });
      }

      // 4. Load new sound
      const { sound } = await Audio.Sound.createAsync(
        { uri: track.audioUrl },
        { shouldPlay: false },
        (status: AVPlaybackStatus) => {
          if (status.isLoaded) {
            // CRITICAL: Precise request ID matching is enough to prevent hallucinations.
            // We removed the !isLoading check to ensure the timeline starts moving 
            // as soon as the sound is ready, without waiting for the entire playTrack 
            // process to conclude.
            if (currentRequestId === trackLoadRequestCounter) {
              set({
                position: Math.floor(status.positionMillis / 1000),
                duration: Math.floor((status.durationMillis || 0) / 1000),
                isPlaying: status.isPlaying,
              });

              if (status.didJustFinish) {
                get().next();
              }
            }
          }
        }
      );

      // 5. Final Guard
      if (currentRequestId !== trackLoadRequestCounter) {
        sound.unloadAsync().catch(() => { });
        return;
      }

      // 6. Success: this is still the intended song.
      soundInstance = sound;
      await sound.playAsync();

    } catch (error) {
      console.error("Critical error in playTrack:", error);
      if (currentRequestId === trackLoadRequestCounter) {
        set({ isPlaying: false, isLoading: false });
      }
    } finally {
      if (currentRequestId === trackLoadRequestCounter) {
        set({ isLoading: false });
      }
    }
  },

  pause: async () => {
    if (soundInstance) {
      await soundInstance.pauseAsync();
      set({ isPlaying: false });
    }
  },

  resume: async () => {
    if (soundInstance) {
      await soundInstance.playAsync();
      set({ isPlaying: true });
    }
  },

  seekTo: async (seconds) => {
    if (soundInstance && !get().isLoading) {
      try {
        await soundInstance.setPositionAsync(seconds * 1000);
        set({ position: seconds });
      } catch (e) {
        console.log("Seek error:", e);
      }
    }
  },

  setQueue: (queue) => {
    set({ queue });
  },

  next: async () => {
    const { queue, currentIndex } = get();
    const nextIndex = (currentIndex + 1) % queue.length;
    if (queue.length > 0) {
      await get().playTrack(queue[nextIndex], queue);
    }
  },

  previous: async () => {
    const { queue, currentIndex } = get();
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    if (queue.length > 0) {
      await get().playTrack(queue[prevIndex], queue);
    }
  },

  toggleFavorite: (track: Track) => {
    const { favorites } = get();
    const exists = favorites.find((t: Track) => t.id === track.id);
    if (exists) {
      set({ favorites: favorites.filter((t: Track) => t.id !== track.id) });
    } else {
      set({ favorites: [...favorites, track] });
    }
  },

  isFavorite: (id: string) => {
    const { favorites } = get();
    return !!favorites.find((t: Track) => t.id === id);
  },

  toggleTheme: () => {
    const nextTheme = get().theme === 'light' ? 'dark' : 'light';
    set({ theme: nextTheme });
    AsyncStorage.setItem('theme', nextTheme).catch(err => console.error('Error saving theme:', err));
  },
  loadTheme: async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        set({ theme: savedTheme });
      }
    } catch (err) {
      console.error('Error loading theme:', err);
    }
  },

  addToQueue: (track) => {
    const { queue } = get();
    if (!queue.find(t => t.id === track.id)) {
      const newQueue = [...queue, track];
      set({ queue: newQueue });
      get().persistState();
    }
  },

  removeFromQueue: (id) => {
    const { queue, currentIndex } = get();
    const newQueue = queue.filter(t => t.id !== id);
    set({ queue: newQueue });
    get().persistState();
  },

  updateQueue: (newQueue) => {
    set({ queue: newQueue });
    get().persistState();
  },

  persistState: async () => {
    try {
      const { favorites, queue } = get();
      await Promise.all([
        AsyncStorage.setItem('favorites', JSON.stringify(favorites)),
        AsyncStorage.setItem('queue', JSON.stringify(queue))
      ]);
    } catch (e) {
      console.error('Error persisting state:', e);
    }
  },

  loadPersistedState: async () => {
    try {
      const [favs, q, theme] = await Promise.all([
        AsyncStorage.getItem('favorites'),
        AsyncStorage.getItem('queue'),
        AsyncStorage.getItem('theme')
      ]);

      set({
        favorites: favs ? JSON.parse(favs) : [],
        queue: q ? JSON.parse(q) : [],
        theme: (theme as 'light' | 'dark') || 'light'
      });
    } catch (e) {
      console.error('Error loading state:', e);
    }
  },
}));
