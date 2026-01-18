# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GameDavid is a full-stack game collection management application. Users can add, view, edit, and delete games from their collection with cover images and platform information.

## Tech Stack

- **Backend:** Express.js + MongoDB (Mongoose ODM)
- **Frontend:** React 18 + React Bootstrap
- **Deployment:** Railway (monorepo with separate backend/frontend services)

## Development Commands

### Backend (from `/backend`)
```bash
npm run dev     # Start with nodemon (auto-reload)
npm start       # Start production server
```

### Frontend (from `/frontend`)
```bash
npm start       # Start dev server
npm run build   # Production build (no sourcemaps)
npm test        # Run tests
```

## Architecture

```
GameDavid/
├── backend/
│   ├── server.js           # Express entry point, MongoDB connection
│   ├── controllers/        # Business logic (gameController.js)
│   ├── models/             # Mongoose schemas (Game.js)
│   ├── routes/             # API endpoints (games.js, upload.js)
│   ├── config/             # Multer file upload config
│   └── uploads/            # Stored cover images
│
└── frontend/
    └── src/
        ├── App.js          # Main component with React Router
        ├── components/     # GameList, GameForm, Navbar
        └── assets/         # Static images
```

## API Endpoints

- `GET/POST /api/games` - List all / Create game
- `GET/PUT/DELETE /api/games/:id` - Single game operations
- `POST /api/upload` - Upload cover image (multipart/form-data)

## Data Model

```javascript
Game {
  name: String (required),
  platform: [String],  // Values: 'PS5', 'Switch', 'Xbox', 'Steam'
  image: String (required, URL to cover image)
}
```

## Environment Variables

**Backend (.env):**
- `MONGODB_URI` - MongoDB connection string
- `PORT` - Server port (default: 5000)

**Frontend (.env):**
- `REACT_APP_API_URL` - Backend API URL

## Key Patterns

- Spanish language used throughout UI and comments
- Platform filtering via multi-select (react-select)
- Dual view modes: grid and list
- Image upload with preview in forms
- Local storage for pagination state persistence
- Bootstrap utility classes + custom hover effects in App.css
