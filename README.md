# GGList

```
                                           /
                        _,.------....___,.' ',.-.
                     ,-'          _,.--"        |
                   ,'         _.-'              .
                  /   ,     ,'                   `
                 .   /     /                     ``.
                 |  |     .                       \.\
       ____      |___._.  |       __               \ `.
     .'    `---""       ``"-.--"'`  \               .  \
    .  ,            __               `              |   .
    `,'         ,-"'  .               \             |    L
   ,'          '    _.'                -._          /    |
  ,`-.    ,".   `--'                      >.      ,'     |
 . .'\'   `-'       __    ,  ,-.         /  `.__.-      ,'
 ||:, .           ,'  ;  /  / \ `        `.    .      .'/
 j|:D  \          `--'  ' ,'_  . .         `.__, \   , /
/ L:_  |                 .  "' :_;                `.'.'
.    ""'                  """""'                    V
 `.                                 .    `.   _,..  `
   `,_   .    .                _,-'/    .. `,'   __  `
    / \`._        ___....----"'  ,'   .'  \ |   '  \  .
   /   `. "`-.--"'         _,' ,'     `---' |    `./  |
  .   _  `""'--.._____..--"   ,             '         |
  | ." `. `-.                /-.           /          ,
  | `._.'    `,_            ;  /         ,'          .
 .'          /| `-.        . ,'         ,           ,
 '-.__ __ _,','    '`-..___;-...__   ,.'\ ____.___.'
 `"^--'..'   '-`-^-'"--    `-^-'`.''"""""`.,^.`.--'
```

https://gglist.app/

GGList is a full-stack app for tracking and ranking user favorites. This version uses Pokémon cards, but it’s built to work with anything: games, movies, books, whatever. Users log in with Google, favorite up to 10 items, and see a leaderboard of top picks across all users.

---

## 🔧 Stack Overview

### Frontend

- **React + Vite + TypeScript**
- Auth via **Google Sign-In**
- Uses **React Context** for auth state
- REST API calls with `fetch`
- Pure CSS
- Deployed on **GCP Cloud Run**

### Backend

- **Node + Express + TypeScript**
- Auth with **JWT** (signed server-side)
- Routes for `/auth`, `/favorites`, `/top`, `/pokemon`
- Local cache layer for Pokémon dataset (cache/pokemon.json) avoids API/database calls
- Protected routes using middleware
- Rate limiting with `express-rate-limit`

### Database

- **PostgreSQL** via Google **Cloud SQL**
- Table: `favorites (user_id, card_id)`
- Seeded with a JSON list of Pokémon cards

---

## ☁️ Google Cloud Platform

- **Cloud Run** (frontend and backend separately containerized)
- **Cloud SQL** for PostgreSQL
- **GitHub Actions** for CI/CD with **Workload Identity Federation**
- **Artifact Registry** for Docker images
- All environment secrets stored securely (nothing committed)

---

## What Makes GGList Reusable

This isn’t just a Pokémon demo, the whole setup is meant to be repurposed:

- Swap in any dataset (games, movies, etc.)
- Favorites system stays the same
- Leaderboard auto-updates from the database
- Minimal changes needed in seed script and UI copy

---

## Local Dev

```bash
# Frontend
cd frontend && npm install && npm run dev

# Backend
cd backend && npm install && npm run dev
```

## Repo Structure (simplified)

```
gglist/
├── backend/
│ ├── src/routes/
│ ├── src/middleware/
│ ├── src/utils/
│ └── Dockerfile
├── frontend/
│ ├── src/
│ └── Dockerfile
└── .github/workflows/
```

## Repo

🔗 github.com/stefanbobrowski/gglist

## Author

### Stefan Bobrowski

🌐 stefanbobrowski.com
📦 github.com/stefanbobrowski
