# Mume_Music_Player
Music streaming app built with React Native (Expo) + TypeScript using the JioSaavn API. Features include search with pagination, full player with seek controls, background playback, synced mini player, shuffle/repeat modes, and persistent queue storage via Zustand and MMKV. Clean, scalable architecture with decoupled audio service.


---

## Features

- JioSaavn music integration (search, albums, playlists, tracks)
- Search with pagination for large result sets
- Full player with seek bar, play/pause, next/previous, shuffle, and repeat modes
- Background playback with system media controls (lock screen / notification)
- Mini player synced with the full player across screens
- Persistent queue, playback state, and preferences using Zustand + MMKV
- Modular, decoupled audio service for easier maintenance and testing
- Type-safe codebase with TypeScript and folder-by-feature structure

---

## Tech Stack

- **Frontend**: React Native (Expo) with TypeScript
- **State Management**: Zustand for global state
- **Storage**: MMKV for fast persistent storage
- **API Integration**: JioSaavn API (unofficial)
- **Audio Engine**: Native audio playback with media controls
- **Build Tool**: Expo & EAS for cross-platform builds

---

## Getting Started

### Prerequisites

- Node.js (v16 LTS or higher)
- npm or yarn package manager
- Expo CLI: `npm install -g expo-cli`
- Android Studio / Xcode for emulator/simulator, or Expo Go app on physical device

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/MadanAyyanavara/Mume_Music_Player.git
   cd Mume_Music_Player
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Environment Variables**
   
   Create a `.env` file in the root directory (if required):
   ```
   JIOSAAVN_BASE_URL=https://your-api-endpoint
   ```

4. **Run the Application**
   ```bash
   npm run start
   # or
   yarn start
   ```
   
   Then:
   - Press `a` for Android emulator/device
   - Press `i` for iOS simulator (macOS only)
   - Scan QR code with Expo Go app

5. **Production Build**
   ```bash
   npx expo prebuild
   npx eas build
   ```

---

## Project Structure


```
mume/
├── src/
│   ├── components/           # Reusable UI components (MiniPlayer, SongListItem, Modals)
│   ├── screens/              # Screen-level components (Home, Player, Search, etc.)
│   ├── navigation/           # Navigation stacks, Tab bar, and Route types
│   ├── services/
│   │   └── api/              # API Client (JioSaavn integration)
│   ├── store/                # Zustand global state (Audio engine & User preferences)
│   ├── hooks/                # Custom React hooks (useTheme, useAudio)
│   ├── types/                # TypeScript interfaces & API response shapes
│   ├── constants/            # Mock data and system-wide constants
│   └── styles/               # Design tokens and theme definitions (Design System)
├── assets/                   # Static assets (Icon, Splash, Sanitized Image assets)
├── App.tsx                   # Main entry point and Provider configuration
├── app.json                  # Expo ecosystem & Native permissions config
├── eas.json                  # EAS Cloud Build profiles (APK & Play Store)
├── tsconfig.json             # TypeScript compiler settings
└── package.json              # Project dependencies & scripts
```


## Architecture

### Layered Architecture Design

The application follows a **modular, decoupled architecture** with clear separation of concerns:

#### 1. **UI Layer** (React Native Components)
- Implements screens and reusable components
- Uses React Navigation for stack/tab navigation
- Components are stateless and rely on custom hooks
- Clean dependency injection through hooks

#### 2. **State Management** (Zustand + MMKV)
- **Zustand Slices**:
  - `playerStore`: Current track, playback status, position
  - `queueStore`: Track list, shuffle/repeat modes
  - `uiStore`: Theme preferences, UI state
- **MMKV Integration**: Persists state across app restarts
- Minimal boilerplate compared to Redux

#### 3. **Audio Service** (Abstraction Layer)
- Encapsulates all audio playback logic
- Exposes clean imperative API:
  - `loadTrack(track)`
  - `play()`, `pause()`, `resume()`
  - `seekTo(positionMs)`
  - `skipNext()`, `skipPrevious()`
  - `setShuffle(enabled)`, `setRepeat(mode)`
- UI never directly calls native audio library
- Easy to swap underlying implementation

#### 4. **Data Layer** (JioSaavn API)
- API client module handles all network requests
- Normalizes raw JSON to strongly-typed entities
- Supports pagination for large datasets
- Public functions:
  - `searchTracks(query, page)`
  - `getAlbumDetails(albumId)`
  - `getPlaylist(playlistId)`

### Data Flow

```
UI Components (React Native)
        ↓
Custom Hooks (usePlayer, useQueue, etc.)
        ↓
Zustand Store (Global State)
        ↓
Audio Service (Play/Pause/Seek) + API Service (Data Fetching)
        ↓
MMKV Storage (Persistence) + JioSaavn API (Data Source)
```

---

## Design Trade-offs

### 1. **Client-side JioSaavn Integration**

**Pros:**
- Simpler development workflow (no backend server needed)
- Faster iteration and prototyping
- Reduced operational complexity

**Cons:**
- Tight coupling to unofficial JioSaavn API
- Rate limiting and API breakage risks
- No API key hiding

**Mitigation:**
- Add a lightweight proxy backend later if needed
- Implement caching strategy
- Monitor API changes

### 2. **Zustand + MMKV vs Redux**

**Why Zustand + MMKV:**
- Minimal boilerplate (less code, easier to reason about)
- MMKV provides extremely fast storage (10-100x faster than AsyncStorage)
- Perfect for medium-sized apps (not enterprise-scale)
- Excellent for persisting queue and playback state

**Trade-off:**
- Smaller ecosystem than Redux
- Fewer debugging/monitoring tools
- Less middleware support

**Use case fit:**
- ✅ Good for music player (simple, fast storage needed)
- ❌ Not ideal for complex enterprise apps

### 3. **Decoupled Audio Service**

**Pros:**
- Clear separation between UI and audio engine
- Easy to unit test audio logic independently
- Simple to migrate to different audio library (Expo AV → react-native-track-player)
- Centralized error handling and logging

**Cons:**
- Extra abstraction layer adds some complexity
- Requires consistent API design
- Potential performance overhead from abstraction

**Justification:**
- Audio is complex (background playback, system integration, queue management)
- Abstraction isolates this complexity, making code more maintainable

### 4. **Expo Managed Workflow vs Bare React Native**

**Expo Managed Advantages:**
- Over-the-air (OTA) updates via Expo
- Strong developer experience and tooling
- EAS Build simplifies cross-platform builds
- Faster development iteration
- Easier to get started (no native setup required)

**Expo Managed Limitations:**
- Constrained by Expo's supported APIs
- Some advanced native customization requires prebuild/Config Plugins
- App size may be larger

**When to switch to Bare Workflow:**
- Need advanced native modules not in Expo
- Require deep OS-level integration
- Performance optimization for specific platforms

### 5. **Folder-by-Feature vs Folder-by-Layer**

**Chosen: Feature-based Structure** (src/screens, src/components, src/services)

**Pros:**
- Easy to locate related code
- Better for team scaling
- Clear feature boundaries
- Simpler code splitting for lazy loading

**Alternative (Layer-based):**
```
src/
  ├── components/
  ├── containers/
  ├── services/
  └── utils/
```

---

## Performance Considerations

1. **Queue Management**: MMKV provides O(1) storage access for queue state
2. **Search Pagination**: Avoids loading entire catalog into memory
3. **Mini Player**: Synced via Zustand without re-rendering entire app
4. **Audio Service**: Native playback prevents JavaScript blocking

---

## Future Improvements

- [ ] Offline downloads and local caching of tracks
- [ ] User authentication and cloud-synced playlists
- [ ] Advanced recommendation engine
- [ ] Dark/light theme toggle
- [ ] Integration tests for playback edge cases
- [ ] Backend proxy server for API stability
- [ ] Analytics and crash reporting

---

## Scripts

```bash
npm run start      # Start Expo dev server
npm run android    # Run on Android emulator/device
npm run ios        # Run on iOS simulator
```

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---


---

## Support

For issues, questions, or suggestions, please open a GitHub issue or contact the maintainer.
