# onYva

A cross-platform social app for sharing and discovering posts on an interactive map. Built with React, Capacitor, Firebase, and Google Maps APIs, onYva enables users to create, explore, and interact with location-based content seamlessly on web and mobile.

## Features

- 🔐 **User Authentication** (Sign up, Login, Password Reset)
- 🗺️ **Interactive Map** with Google Maps integration
- 📝 **Create & View Posts** with location tagging
- 👤 **User Profiles** and personalized feeds
- 🔍 **Search** for places and posts
- ♾️ **Infinite Scroll** for feeds
- ⚡ **Real-time updates** via Firebase
- 📱 **Mobile-ready** with Capacitor (Android/iOS)
- ☁️ **Serverless Functions** (e.g., Google Maps review scoring)
- 🎨 **Modern UI** with TailwindCSS, DaisyUI, and tw-elements

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm
- Firebase CLI (`npm install -g firebase-tools`)
- [Google Maps API Key](https://developers.google.com/maps/documentation/javascript/get-api-key)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd onyva
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in your Firebase and Google Maps API keys.

4. **Firebase setup:**
   - Initialize Firebase: `firebase init`
   - Emulators: `firebase emulators:start` (for local dev)

5. **Run the app:**
   ```bash
   npm start
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000)

### Scripts
- `npm start` — Start the development server
- `npm run build` — Build for production
- `npm test` — Run tests
- `npm run eject` — Eject configuration (not recommended)

### Mobile (Capacitor)
- `npx cap add android` / `npx cap add ios` — Add mobile platforms
- `npx cap open android` / `npx cap open ios` — Open native IDE
- `npx cap sync` — Sync web code to native

### Firebase Functions
- Located in `/functions`
- Example: `getScore` — Calculates a score based on Google Maps review data

### Project Structure
- `src/pages/` — Main app pages (Home, Map, Search, Profile, etc.)
- `src/components/` — Reusable UI components
- `src/services/persistence/` — Data management (user, post)
- `functions/` — Firebase serverless backend

## Contributing

1. Fork the repo and create your branch (`git checkout -b feature/your-feature`)
2. Commit your changes (`git commit -am 'Add new feature'`)
3. Push to the branch (`git push origin feature/your-feature`)
4. Open a Pull Request

## License

MIT

---

*onYva — Explore, Share, Connect.*
