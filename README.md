<div align="center">

<img src="https://img.shields.io/badge/🌿-WildGuard-52b788?style=for-the-badge&labelColor=1a3a2a&color=52b788" alt="WildGuard" height="40"/>

# WildGuard — Wildlife Conservation Platform

**A full-stack web application for wildlife conservation, species tracking,**
**interactive sighting maps, species adoption, and community-driven conservation events.**

<br/>

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.18-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com/atlas)
[![EJS](https://img.shields.io/badge/EJS-Templates-B4CA65?style=flat-square)](https://ejs.co)
[![Render](https://img.shields.io/badge/Deployed_on-Render-46E3B7?style=flat-square&logo=render&logoColor=white)](https://render.com)
[![Uptime](https://img.shields.io/badge/Monitored_by-UptimeRobot-green?style=flat-square&logo=uptimerobot&logoColor=white)](https://uptimerobot.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

<br/>

[🌐 Live Demo](https://wildguard-rn12.onrender.com) &nbsp;·&nbsp;
[🚀 Deploy Your Own](#-deployment-on-render) &nbsp;·&nbsp;
[🛠️ Local Setup](#-local-setup) &nbsp;·&nbsp;
[📸 Features](#-features)

<br/>

> 🟢 Monitored 24/7 by UptimeRobot — always awake, no cold starts.

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Local Setup](#-local-setup)
- [Deployment on Render](#-deployment-on-render)
- [Environment Variables](#-environment-variables)
- [Pages & Routes](#-pages--routes)
- [Role-Based Access](#-role-based-access)
- [First Admin Setup](#-first-admin-setup)
- [Conservation Points & Badges](#-conservation-points--badges)
- [License](#-license)

---

## 🌿 About

WildGuard is a community-driven wildlife conservation platform that connects conservationists, researchers, and nature lovers. Users can report wildlife sightings on an interactive GPS map, sponsor endangered species through a tiered adoption system, register for conservation events, and earn points and badges for their contributions.

Admins manage the platform — approving species reports, verifying sightings, creating events, and managing user roles — all from a dedicated admin dashboard.

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🔐 Authentication
- Signup with profile photo upload
- Custom username and bio
- Secure login / logout
- Session-based authentication
- Password hashing with bcryptjs

</td>
<td width="50%">

### 🗺️ Wildlife Sighting Map
- Interactive Leaflet.js map
- Click to drop GPS pin on exact location
- Color-coded condition markers
- 🟢 Healthy · 🟠 Injured · 🔴 Dead · ⚫ Unknown
- ⭐ Gold ring = admin verified
- Report form with species, count, description

</td>
</tr>
<tr>
<td width="50%">

### 💚 Species Adoption
- Sponsor endangered species
- Three sponsorship tiers:
  - 🌱 **Supporter** — $5/mo
  - 🛡️ **Guardian** — $15/mo
  - 🏆 **Champion** — $30/mo
- Unique certificate ID per adoption
- **Downloadable PDF certificate**
- Live sponsor count per species

</td>
<td width="50%">

### 🦁 Species Directory
- Full searchable species database
- Filter by category and conservation status
- Users submit new species for review
- Admin approval workflow
- Status badges from Least Concern → Extinct

</td>
</tr>
<tr>
<td width="50%">

### 📅 Conservation Events
- Browse upcoming events
- Filter by category and search by name
- One-click register / unregister
- Live capacity tracker
- Admins create and manage events

</td>
<td width="50%">

### 🔔 Notifications
- Live unread badge count in navbar
- Event registration confirmations
- Species report approval updates
- Sighting verification alerts
- Adoption certificate issued alerts

</td>
</tr>
<tr>
<td width="50%">

### 🎖️ Points & Badges
- Earn conservation points for actions
- Auto-awarded milestone badges
- Points displayed on profile
- Badges shown on profile page

</td>
<td width="50%">

### ⚙️ Admin Panel
- Platform stats dashboard
- Species approval / rejection
- Sighting verification
- Event creation and deletion
- User role management

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Runtime** | Node.js 18+ | Server-side JavaScript |
| **Framework** | Express.js 4.18 | HTTP routing & middleware |
| **Database** | MongoDB Atlas | Cloud NoSQL database |
| **ODM** | Mongoose 7 | MongoDB object modeling |
| **Views** | EJS Templates | Server-side HTML rendering |
| **Auth** | bcryptjs + express-session | Password hashing & sessions |
| **Session Store** | connect-mongo | Persist sessions in MongoDB |
| **Map** | Leaflet.js + OpenStreetMap | Interactive wildlife map |
| **File Uploads** | Multer | Avatar image uploads |
| **Fonts** | Google Fonts | Playfair Display + DM Sans |
| **Styling** | Custom CSS | No frameworks, hand-crafted |
| **Deployment** | Render | Free cloud hosting |

---

## 📁 Project Structure

```
wildguard/
│
├── 📄 server.js                    # App entry point — Express setup, routes, DB
├── 📄 package.json                 # Dependencies and npm scripts
├── 📄 render.yaml                  # Render deployment configuration
├── 📄 .env.example                 # Environment variables template
├── 📄 .gitignore
│
├── 📂 middleware/
│   └── auth.js                     # requireLogin · requireAdmin · redirectIfLoggedIn
│
├── 📂 models/                      # Mongoose schemas
│   ├── User.js                     # Auth + avatar + role + points + badges
│   ├── Event.js                    # Conservation events + registrations
│   ├── Species.js                  # Species directory + approval status
│   ├── Sighting.js                 # Wildlife sighting reports + GPS coords
│   ├── Adoption.js                 # Species sponsorships + certificate IDs
│   └── Notification.js             # User notification messages
│
├── 📂 routes/                      # Express route handlers
│   ├── index.js                    # GET /  —  Homepage
│   ├── auth.js                     # /auth/login · /signup · /logout
│   ├── events.js                   # /events — list, show, register, create, delete
│   ├── species.js                  # /species — list, show, report
│   ├── sightings.js                # /sightings — map, report, verify, delete
│   ├── adoptions.js                # /adoptions — sponsor, certificate, cancel
│   ├── admin.js                    # /admin — dashboard, species, users
│   ├── profile.js                  # /profile — view and update
│   └── notifications.js            # /notifications — list and unread count
│
├── 📂 views/                       # EJS template files
│   ├── index.ejs                   # Homepage — hero, events, species, CTA
│   ├── profile.ejs                 # User profile + edit form + badges
│   ├── notifications.ejs           # Notification feed
│   ├── 404.ejs                     # Not found page
│   │
│   ├── 📂 partials/
│   │   ├── header.ejs              # Navbar + flash messages + <head>
│   │   └── footer.ejs              # Footer + scripts
│   │
│   ├── 📂 auth/
│   │   ├── login.ejs
│   │   └── signup.ejs
│   │
│   ├── 📂 events/
│   │   ├── index.ejs               # Events list with filters
│   │   ├── show.ejs                # Event detail + register
│   │   └── create.ejs              # Admin: create event form
│   │
│   ├── 📂 species/
│   │   ├── index.ejs               # Species directory with filters
│   │   ├── show.ejs                # Species detail page
│   │   └── report.ejs              # User: report species form
│   │
│   ├── 📂 sightings/
│   │   ├── index.ejs               # Interactive map + sightings list
│   │   └── report.ejs              # Report form with map pin
│   │
│   ├── 📂 adoptions/
│   │   ├── index.ejs               # Adoption tiers + species grid
│   │   └── certificate.ejs         # Downloadable PDF certificate
│   │
│   └── 📂 admin/
│       ├── dashboard.ejs           # Stats + recent users
│       ├── species.ejs             # Pending approvals + approved list
│       └── users.ejs               # User list + role toggle
│
└── 📂 public/                      # Static assets
    ├── 📂 css/
    │   └── style.css               # Full custom stylesheet
    ├── 📂 js/
    │   └── app.js                  # Client-side scripts
    ├── 📂 images/
    │   ├── default-avatar.svg
    │   ├── event-default.svg
    │   └── species-default.svg
    └── 📂 uploads/
        └── avatars/                # User uploaded profile photos
```

---

## 🚀 Local Setup

### Prerequisites

| Tool | Minimum Version | Check |
|------|----------------|-------|
| Node.js | v18.0.0 | `node --version` |
| npm | v9.0.0 | `npm --version` |
| Git | any | `git --version` |

You also need a free [MongoDB Atlas](https://mongodb.com/atlas) account.

### Step-by-Step

**1. Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/wildguard.git
cd wildguard
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up MongoDB Atlas**
- Create a free M0 cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
- Create a database user with read/write access
- Under Network Access → Add `0.0.0.0/0` (allow all IPs)
- Click Connect → Drivers → copy your connection string

**4. Configure environment variables**
```bash
cp .env.example .env
```

Open `.env` and fill in your values:
```env
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/wildlifeDB?retryWrites=true&w=majority
SESSION_SECRET=your_long_random_secret_here
NODE_ENV=development
```

**5. Start the development server**
```bash
npm run dev
```

**6. Open in browser**
```
http://localhost:3000
```

> Nodemon will auto-restart the server when you save any file.

---

## ☁️ Deployment on Render

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "Initial WildGuard deployment"
git remote add origin https://github.com/YOUR_USERNAME/wildguard.git
git push -u origin main
```

### Step 2 — Create Render Web Service
1. Go to [render.com](https://render.com) and sign up (free)
2. Click **New** → **Web Service**
3. Connect your GitHub account → select your repository

### Step 3 — Configure Build Settings

| Setting | Value |
|---------|-------|
| Language | Node |
| Branch | `main` |
| Root Directory | *(leave empty)* |
| Build Command | `npm install` |
| Start Command | `node server.js` |
| Instance Type | **Free** |

### Step 4 — Add Environment Variables

In the Environment section, add:

| Key | Value |
|-----|-------|
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `SESSION_SECRET` | Any long random string |
| `NODE_ENV` | `production` |

### Step 5 — Deploy
Click **Deploy Web Service** — Render builds and deploys automatically.

Your live URL will be:
```
https://your-app-name.onrender.com
```

> **Auto-deploy:** Every `git push` to `main` triggers a new deployment automatically.

> 🟢 **Always Online:** App is monitored every 5 minutes by [UptimeRobot](https://uptimerobot.com) to prevent Render free tier sleep.

---

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | ✅ Yes | MongoDB Atlas connection string |
| `SESSION_SECRET` | ✅ Yes | Secret key for signing session cookies |
| `PORT` | ❌ Optional | Server port (default: 3000) |
| `NODE_ENV` | ❌ Optional | Set to `production` on Render |

---

## 📸 Pages & Routes

| Route | Page | Access |
|-------|------|--------|
| `GET /` | Homepage — hero, stats, events, species | Public |
| `GET /auth/login` | Login page | Public |
| `GET /auth/signup` | Signup with avatar upload | Public |
| `POST /auth/logout` | Logout | Logged in |
| `GET /events` | Events list with search & filter | Public |
| `GET /events/:id` | Event detail + registration | Public |
| `POST /events/:id/register` | Register / unregister | Logged in |
| `GET /events/admin/create` | Create event form | **Admin** |
| `GET /species` | Species directory | Public |
| `GET /species/:id` | Species detail page | Public |
| `GET /species/report/new` | Report species form | Logged in |
| `GET /sightings` | Interactive sighting map | Public |
| `GET /sightings/report` | Report a sighting | Logged in |
| `POST /sightings/:id/verify` | Verify sighting | **Admin** |
| `GET /adoptions` | Adoption tiers + species | Logged in |
| `POST /adoptions/adopt` | Sponsor a species | Logged in |
| `GET /adoptions/:id/certificate` | View / download certificate | Logged in |
| `GET /profile` | User profile + edit | Logged in |
| `GET /notifications` | Notification feed | Logged in |
| `GET /admin` | Admin dashboard | **Admin** |
| `GET /admin/species` | Manage species approvals | **Admin** |
| `GET /admin/users` | Manage user roles | **Admin** |

---

## 👥 Role-Based Access

### 🙍 User
| Action | Points Earned |
|--------|--------------|
| Sign up | Welcome notification |
| Report a wildlife sighting | +10 pts |
| Get sighting verified by admin | +15 bonus pts |
| Adopt a species (Supporter) | +50 pts |
| Adopt a species (Guardian) | +150 pts |
| Adopt a species (Champion) | +300 pts |
| Register for an event | Notification |
| Report a species for review | Pending admin |

### 👑 Admin
| Action | |
|--------|--|
| Create conservation events | ✅ |
| Delete events | ✅ |
| Approve species reports | ✅ |
| Reject species reports | ✅ |
| Verify wildlife sightings | ✅ |
| Delete sightings | ✅ |
| Promote users to admin | ✅ |
| Demote admins to user | ✅ |
| View admin dashboard stats | ✅ |

---

## 👑 First Admin Setup

After deploying, promote yourself to admin:

1. Sign up at `/auth/signup`
2. Log into **MongoDB Atlas** → Browse Collections → `wildlifeDB` → `users`
3. Find your user document → click Edit
4. Change `"role": "user"` → `"role": "admin"`
5. Save → Log out → Log back in
6. **Admin Panel** now appears in your navbar

> From the Admin Panel → Manage Users, you can promote/demote other users without ever touching Atlas again.

---

## 🎖️ Conservation Points & Badges

Earn points through conservation actions and unlock badges automatically:

| Badge | Icon | Points Required |
|-------|------|----------------|
| First Steps | 🌱 | 10 pts |
| Wildlife Watcher | 🔭 | 50 pts |
| Conservation Hero | 🦸 | 100 pts |
| Species Guardian | 🛡️ | 250 pts |
| Wildlife Champion | 🏆 | 500 pts |
| Legend of the Wild | 👑 | 1,000 pts |

Points and badges are displayed on every user's profile page.

---

## 🐛 Common Issues

<details>
<summary><strong>MongoDB connection refused (EREFUSED)</strong></summary>

- Check your `MONGO_URI` in `.env` has no angle brackets `< >`
- Go to Atlas → Network Access → confirm `0.0.0.0/0` is **Active**
- Try switching to mobile hotspot — some routers block MongoDB DNS
- Run `nslookup your-cluster.mongodb.net 8.8.8.8` to test DNS resolution

</details>

<details>
<summary><strong>Port 3000 already in use (EADDRINUSE)</strong></summary>

```bash
# Find and kill the process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Or change the port in .env
PORT=3001
```

</details>

<details>
<summary><strong>.env file not being read</strong></summary>

- Make sure `.env` is in the same folder as `server.js`
- On Windows, check it's not saved as `.env.txt` (enable file extensions in Explorer)
- No quotes around values: `MONGO_URI=mongodb+srv://...` ✅ not `MONGO_URI="mongodb+srv://..."` ❌

</details>

<details>
<summary><strong>Avatar not showing</strong></summary>

- Visit `http://localhost:3000/images/default-avatar.svg` — if 404, the `public/images/` folder is missing
- Check for a `{public` folder (malformed) — delete it, keep the `public` folder
- Existing users may need their avatar field updated in Atlas to `/images/default-avatar.svg`

</details>

---

## 📦 npm Scripts

```bash
npm start       # Start with Node (production)
npm run dev     # Start with Nodemon (auto-restart on changes)
```

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 🟢 Uptime Monitoring

This app is monitored 24/7 using **[UptimeRobot](https://uptimerobot.com)** (free tier).

| Setting | Value |
|---------|-------|
| Monitor Type | HTTP(s) |
| URL | `https://your-app-name.onrender.com` |
| Check Interval | Every 5 minutes |
| Alerts | Email on downtime |

UptimeRobot pings the app every 5 minutes, preventing Render's free tier from spinning down due to inactivity. This keeps the app **always responsive** with no cold start delays.

---

## 📄 License

This project is licensed under the **MIT License** — free to use, modify, and distribute.

---

<div align="center">

**Built with 🌿 for wildlife conservation**

*WildGuard — Protecting wildlife, one species at a time.*

<br/>

[![Star this repo](https://img.shields.io/github/stars/YOUR_USERNAME/wildguard?style=social)](https://github.com/YOUR_USERNAME/wildguard)

</div>
