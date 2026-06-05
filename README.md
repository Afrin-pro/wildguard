# 🌿 WildGuard — Wildlife Conservation Web App

A full-stack wildlife conservation platform built with Node.js, Express, MongoDB Atlas, and EJS. Users can register for conservation events, report species sightings, and receive notifications. Admins manage events, approve species, and control user roles.

---

## 📁 Project Structure

```
wildlife-app/
├── server.js                  # App entry point
├── package.json
├── .env                       # Your environment variables (create this)
├── .env.example               # Template for .env
│
├── config/                    # (reserved for future config)
│
├── middleware/
│   └── auth.js                # requireLogin, requireAdmin, redirectIfLoggedIn
│
├── models/
│   ├── User.js                # username, email, password, avatar, role, bio
│   ├── Event.js               # title, date, location, category, capacity, registeredUsers
│   ├── Species.js             # name, habitat, conservationStatus, approvedByAdmin
│   └── Notification.js        # user, message, type, read
│
├── routes/
│   ├── index.js               # GET /  (homepage)
│   ├── auth.js                # GET/POST /auth/login, /signup, /logout
│   ├── events.js              # GET/POST /events (list, show, register, create, delete)
│   ├── species.js             # GET/POST /species (list, show, report)
│   ├── admin.js               # GET/POST /admin (dashboard, species approval, user roles)
│   ├── profile.js             # GET/POST /profile (view, update)
│   └── notifications.js       # GET /notifications (list, unread count)
│
├── views/
│   ├── index.ejs              # Homepage with hero, events, species, CTA
│   ├── profile.ejs            # User profile + edit form + registered events
│   ├── notifications.ejs      # Notification feed
│   ├── 404.ejs                # Not found page
│   ├── partials/
│   │   ├── header.ejs         # Navbar + flash messages + <head>
│   │   └── footer.ejs         # Footer + scripts
│   ├── auth/
│   │   ├── login.ejs
│   │   └── signup.ejs
│   ├── events/
│   │   ├── index.ejs          # Events list with filters
│   │   ├── show.ejs           # Event detail + register button
│   │   └── create.ejs         # Admin: create event form
│   ├── species/
│   │   ├── index.ejs          # Species directory with filters
│   │   ├── show.ejs           # Species detail page
│   │   └── report.ejs         # User: report species form
│   └── admin/
│       ├── dashboard.ejs      # Stats + recent users
│       ├── species.ejs        # Approve/reject species reports
│       └── users.ejs          # Toggle admin roles
│
└── public/
    ├── css/
    │   └── style.css
    ├── js/
    │   └── app.js
    ├── images/
    │   ├── default-avatar.svg
    │   ├── event-default.svg
    │   └── species-default.svg
    └── uploads/
        └── avatars/           # User-uploaded profile photos (auto-created)
```

---

## ✅ Prerequisites

Make sure you have these installed on your computer:

| Tool | Version | Check |
|------|---------|-------|
| Node.js | v18+ | `node --version` |
| npm | v9+ | `npm --version` |
| Git | any | `git --version` |
| MongoDB Atlas account | free | [mongodb.com/atlas](https://mongodb.com/atlas) |

---

## 🚀 Local Setup (Step by Step)

### Step 1 — Clone / Download the project

If you downloaded the zip, extract it. Otherwise:
```bash
git clone <your-repo-url>
cd wildlife-app
```

### Step 2 — Install dependencies

```bash
npm install
```

This installs: express, mongoose, ejs, bcryptjs, express-session, connect-mongo, multer, dotenv.

### Step 3 — Set up MongoDB Atlas

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) and sign up for free
2. Create a **free M0 cluster** (any region)
3. Under **Database Access** → Add a database user with username + password
4. Under **Network Access** → Add IP `0.0.0.0/0` (allow all, fine for development)
5. Click **Connect** → **Drivers** → copy the connection string:
   ```
   mongodb+srv://youruser:<password>@cluster0.xxxxx.mongodb.net/
   ```

### Step 4 — Create your `.env` file

Copy the example file:
```bash
cp .env.example .env
```

Open `.env` and fill in your values:
```env
PORT=3000
MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/wildlife_conservation?retryWrites=true&w=majority
SESSION_SECRET=pick_any_long_random_string_here_like_xK92mPqR7vNz
NODE_ENV=development
```

> ⚠️ Replace `youruser`, `yourpassword`, and `cluster0.xxxxx` with your actual Atlas credentials.  
> The database name `wildlife_conservation` will be created automatically.

### Step 5 — Run the app

```bash
# Standard start
npm start

# Development mode with auto-restart (recommended)
npm run dev
```

You should see:
```
✅ MongoDB Atlas connected
🌿 Wildlife App running on http://localhost:3000
```

Open your browser at **http://localhost:3000**

---

## 👤 Creating Your First Admin

After the app is running:

1. Go to `http://localhost:3000/auth/signup` and create an account normally
2. Log into **MongoDB Atlas** → **Browse Collections** → `wildlife_conservation` → `users`
3. Find your user document and click the edit (pencil) icon
4. Change `"role": "user"` → `"role": "admin"` and save
5. Log out and back in — you'll now see the **Admin Panel** in the navbar

From the Admin Panel you can promote other users to admin without touching the database again.

---

## 🎯 Features by Role

### All Visitors
- Browse the homepage with stats, upcoming events, featured species
- View all events and species with filters and search
- View individual event and species detail pages

### Logged-in Users
- Register / unregister for conservation events
- Report new species sightings (sent for admin review)
- View and edit their profile (username, bio, avatar photo)
- Receive notifications (welcome, event confirmations, species approval)

### Admins
- Create and delete events
- Approve or reject species reports
- Promote/demote users to admin role
- View admin dashboard with platform stats

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| Views | EJS templates |
| Auth | bcryptjs + express-session + connect-mongo |
| File uploads | Multer |
| Fonts | Google Fonts (Playfair Display + DM Sans) |
| Styling | Custom CSS (no frameworks) |

---

## 🔧 Common Issues

**"Cannot find module" error**
```bash
npm install   # re-run this
```

**MongoDB connection error**
- Double-check your `MONGODB_URI` in `.env` — no angle brackets `<>` in final string
- Make sure your IP is whitelisted in Atlas Network Access

**Port already in use**
```bash
# Change PORT in .env to another number e.g. 3001
PORT=3001
```

**Uploaded images not showing**
- The `public/uploads/avatars/` folder is created automatically on first upload
- Make sure the `public/` folder exists (it's included in the project)

---

## 📦 npm Scripts

```bash
npm start      # Run with node (production)
npm run dev    # Run with nodemon (auto-restarts on file changes)
```

To install nodemon globally if needed:
```bash
npm install -g nodemon
```
