# NativeKnows — Complete Product Documentation

> **Real Spots. Real Prices. Zero Ads.**
> A community-powered platform protecting tourists from scams using local knowledge.

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Feature Map](#2-feature-map)
3. [Tech Stack](#3-tech-stack)
4. [Project Structure](#4-project-structure)
5. [Database Schema](#5-database-schema)
6. [API Reference & How to Fetch APIs](#6-api-reference--how-to-fetch-apis)
7. [Setting Up the Backend](#7-setting-up-the-backend)
8. [Frontend Setup](#8-frontend-setup)
9. [Authentication & User Roles](#9-authentication--user-roles)
10. [Environment Variables](#10-environment-variables)
11. [GitHub Repository Setup](#11-github-repository-setup)
12. [Deployment Guide](#12-deployment-guide)
13. [Revenue Model](#13-revenue-model)
14. [Roadmap](#14-roadmap)

---

## 1. Product Overview

**NativeKnows** is a mobile-first web application that gives tourists access to authentic local spots — restaurants, cafes, street food stalls, and activities — verified and submitted by real locals.

### Core Problems Solved
- Tourists getting overcharged due to "tourist pricing"
- Fake/paid reviews misleading visitors
- Authentic local spots remaining invisible

### Key Differentiators vs Google Maps
| Feature | Google Maps | NativeKnows |
|---|---|---|
| Paid promotion spots | Yes | Never |
| Tourist trap score | No | Yes |
| Price comparison (local vs tourist) | No | Yes |
| Locals-only hidden spots | No | Yes |
| Scam heatmap | No | Yes |
| Bill-verified reviews | No | Yes |

---

## 2. Feature Map

### Screen 1: Discover
- Spot cards with Tourist Trap Risk Score (0–100%)
- Category filtering (Street Food, Cafe, Restaurant, etc.)
- Search by name or area
- "Locals Only" badge for verified-local exclusive spots
- Price transparency (local avg vs tourist avg)
- "Brutally Honest Review" section per spot
- Spot detail page with full pricing breakdown and reporting

### Screen 2: Scam Alert Map
- City-level heatmap of scam activity
- Alert types: Overcharging, Fake Guide, Pickpocket
- Severity levels: Low / Medium / High
- Anonymous community reporting
- Real-time alert list

### Screen 3: Local Guides (Reverse Influencer)
- Follow real locals, not restaurants
- Trust Score per guide (based on verified contributions)
- Guide types: Street Food Hunter, Budget Traveler, Hidden Gem Finder, Student Scout
- Follower/post/trust stats per guide

### Screen 4: Submit a Spot
- 3-step form: Basic Info → Pricing & Description → Review
- Bill photo upload (verifies authenticity)
- GPS verification at location
- LocalPoints reward system (+50 pts per verified submission)

### Screen 5: Profile
- Tourist vs Local mode toggle (unlocks hidden spots)
- LocalPoints balance and rewards ladder
- Perks: discounts, badge unlocks, premium access

---

## 3. Tech Stack

### Frontend (Mobile App)
```
Framework:     React Native (Expo) — for iOS + Android
Web Version:   React.js (same codebase via Expo Web)
Styling:       NativeWind (Tailwind for React Native)
Navigation:    React Navigation v6
State:         Zustand (lightweight global store)
Maps:          React Native Maps (Google Maps SDK)
Camera/Upload: Expo ImagePicker + Expo Camera
Location:      Expo Location
```

### Backend
```
Runtime:       Node.js (v18+)
Framework:     Express.js
Database:      PostgreSQL (primary) + Redis (caching/sessions)
ORM:           Prisma
Auth:          Supabase Auth (or Firebase Auth)
File Storage:  Cloudinary (bill photos, avatars)
Maps API:      Google Maps Platform
Push Notifs:   Expo Push Notifications
```

### Infrastructure
```
Hosting:       Railway.app (backend) or Render.com
DB Hosting:    Supabase (PostgreSQL + Auth + Storage)
CDN:           Cloudflare
CI/CD:         GitHub Actions
```

---

## 4. Project Structure

```
nativeknows/
├── apps/
│   ├── mobile/                  # React Native (Expo) app
│   │   ├── src/
│   │   │   ├── screens/
│   │   │   │   ├── DiscoverScreen.tsx
│   │   │   │   ├── MapScreen.tsx
│   │   │   │   ├── GuidesScreen.tsx
│   │   │   │   ├── SubmitScreen.tsx
│   │   │   │   └── ProfileScreen.tsx
│   │   │   ├── components/
│   │   │   │   ├── SpotCard.tsx
│   │   │   │   ├── TrapScoreBadge.tsx
│   │   │   │   ├── PriceTransparency.tsx
│   │   │   │   └── BottomNav.tsx
│   │   │   ├── store/
│   │   │   │   └── useStore.ts       # Zustand global state
│   │   │   ├── api/
│   │   │   │   └── client.ts         # Axios API client
│   │   │   └── utils/
│   │   │       └── trapScore.ts      # Trap score calculator
│   │   ├── app.json
│   │   └── package.json
│   └── web/                     # React.js web dashboard (admin)
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── spots.ts
│   │   │   ├── users.ts
│   │   │   ├── reports.ts
│   │   │   ├── guides.ts
│   │   │   └── alerts.ts
│   │   ├── controllers/
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   └── rateLimit.ts
│   │   ├── services/
│   │   │   ├── trapScoreService.ts
│   │   │   └── pointsService.ts
│   │   └── app.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
├── .github/
│   └── workflows/
│       └── ci.yml
└── README.md
```

---

## 5. Database Schema

### PostgreSQL via Prisma

```prisma
// prisma/schema.prisma

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String
  handle        String    @unique
  userType      UserType  @default(TOURIST)
  trustScore    Int       @default(50)
  localPoints   Int       @default(0)
  isVerified    Boolean   @default(false)
  city          String?
  createdAt     DateTime  @default(now())
  
  spots         Spot[]    @relation("SubmittedBy")
  reviews       Review[]
  reports       ScamReport[]
  following     Follow[]  @relation("Follower")
  followers     Follow[]  @relation("Following")
}

enum UserType {
  TOURIST
  LOCAL
  ADMIN
}

model Spot {
  id            String    @id @default(cuid())
  name          String
  category      String
  area          String
  city          String
  latitude      Float
  longitude     Float
  description   String
  honestTake    String
  isLocalsOnly  Boolean   @default(false)
  isVerified    Boolean   @default(false)
  trapScore     Float     @default(0)    // 0–100
  localPrice    Float?
  touristPrice  Float?
  priceVariance Float?
  rating        Float     @default(0)
  reviewCount   Int       @default(0)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  submittedBy   User      @relation("SubmittedBy", fields: [userId], references: [id])
  userId        String
  reviews       Review[]
  reports       ScamReport[]
  tags          Tag[]
  photos        Photo[]
}

model Review {
  id            String    @id @default(cuid())
  rating        Int       // 1–5
  text          String
  pricePaid     Float?
  billPhotoUrl  String?
  gpsVerified   Boolean   @default(false)
  billVerified  Boolean   @default(false)
  submittedAt   DateTime  @default(now())
  
  spot          Spot      @relation(fields: [spotId], references: [id])
  spotId        String
  user          User      @relation(fields: [userId], references: [id])
  userId        String
}

model ScamReport {
  id            String      @id @default(cuid())
  type          AlertType
  severity      Severity
  description   String
  latitude      Float
  longitude     Float
  area          String
  isAnonymous   Boolean     @default(true)
  createdAt     DateTime    @default(now())
  
  spot          Spot?       @relation(fields: [spotId], references: [id])
  spotId        String?
  user          User?       @relation(fields: [userId], references: [id])
  userId        String?
}

enum AlertType {
  OVERCHARGING
  FAKE_GUIDE
  PICKPOCKET
  FAKE_REVIEWS
  OTHER
}

enum Severity {
  LOW
  MEDIUM
  HIGH
}

model Follow {
  follower      User      @relation("Follower", fields: [followerId], references: [id])
  followerId    String
  following     User      @relation("Following", fields: [followingId], references: [id])
  followingId   String
  
  @@id([followerId, followingId])
}

model Tag {
  id    String  @id @default(cuid())
  name  String
  spot  Spot    @relation(fields: [spotId], references: [id])
  spotId String
}

model Photo {
  id        String  @id @default(cuid())
  url       String
  type      String  // 'bill', 'spot', 'menu'
  spot      Spot    @relation(fields: [spotId], references: [id])
  spotId    String
}
```

---

## 6. API Reference & How to Fetch APIs

### A. Google Maps Platform

**What it's used for:** Interactive map, GPS verification, geocoding

**Step-by-step setup:**
1. Go to https://console.cloud.google.com
2. Create a new project → "NativeKnows"
3. Enable these APIs:
   - Maps JavaScript API
   - Maps SDK for Android / iOS
   - Geocoding API
   - Places API
4. Go to Credentials → Create API Key
5. Restrict the key to your app's package name / SHA fingerprint

**Usage in React Native:**
```bash
npx expo install react-native-maps
```

```javascript
// src/screens/MapScreen.tsx
import MapView, { Marker, Heatmap } from 'react-native-maps';

const MapScreen = () => {
  return (
    <MapView
      provider="google"
      style={{ flex: 1 }}
      initialRegion={{
        latitude: 28.6139,
        longitude: 77.2090,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      {scamAlerts.map(alert => (
        <Marker
          key={alert.id}
          coordinate={{ latitude: alert.lat, longitude: alert.lng }}
          title={alert.area}
        />
      ))}
    </MapView>
  );
};
```

---

### B. Cloudinary (Image Upload)

**What it's used for:** Storing bill photos, spot images, user avatars

**Setup:**
1. Sign up at https://cloudinary.com (free tier: 25GB)
2. Dashboard → Copy: Cloud Name, API Key, API Secret
3. Create upload presets (Settings → Upload → Add upload preset)
   - Set to "Unsigned" for client-side uploads

**Usage:**
```bash
npm install cloudinary-react
```

```javascript
// src/utils/uploadImage.ts
export const uploadBillPhoto = async (imageUri: string) => {
  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'bill.jpg',
  } as any);
  formData.append('upload_preset', 'nativeknows_bills');
  formData.append('folder', 'bills');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );
  
  const data = await response.json();
  return data.secure_url; // Store this URL in your database
};
```

---

### C. Supabase (Auth + Database + Storage)

**What it's used for:** User authentication, PostgreSQL hosting, file storage

**Setup:**
1. Go to https://supabase.com → New Project
2. Note your: Project URL, anon key, service_role key
3. Run your Prisma schema against Supabase's PostgreSQL

**Install:**
```bash
npm install @supabase/supabase-js
```

**Auth setup:**
```javascript
// src/api/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Sign up
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { data, error };
};

// Sign in
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
};

// Get current user
export const getUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};
```

---

### D. Your Own REST API (Express.js Backend)

**Base URL:** `https://api.nativeknows.app/v1`

**Key endpoints:**

```
GET    /spots                    Get all spots (with filters)
GET    /spots/:id                Get spot by ID
POST   /spots                    Submit new spot (auth required)
PATCH  /spots/:id/report         Report issue with spot

GET    /spots/:id/prices         Get price comparison data
POST   /spots/:id/prices         Submit bill data

GET    /alerts                   Get scam alerts by city
POST   /alerts                   Submit anonymous alert

GET    /guides                   Get local guides list
POST   /guides/:id/follow        Follow a guide

GET    /users/me                 Get my profile
GET    /users/me/points          Get points & rewards
```

**Example API calls from the app:**
```javascript
// src/api/client.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'https://api.nativeknows.app/v1',
  timeout: 10000,
});

// Add auth token to every request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Fetch spots
export const getSpots = (params?: { category?: string; city?: string }) =>
  api.get('/spots', { params });

// Submit new spot
export const submitSpot = (data: SpotSubmission) =>
  api.post('/spots', data);

// Get trap score for a spot
export const getTrapScore = (spotId: string) =>
  api.get(`/spots/${spotId}/trap-score`);
```

---

### E. Expo Location (GPS Verification)

```bash
npx expo install expo-location
```

```javascript
// src/utils/gpsVerify.ts
import * as Location from 'expo-location';

export const verifyAtLocation = async (spotLat: number, spotLng: number) => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') throw new Error('Location permission denied');

  const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
  const { latitude, longitude } = location.coords;

  // Calculate distance in meters
  const distance = getDistanceMeters(latitude, longitude, spotLat, spotLng);
  
  return {
    verified: distance < 200, // within 200 meters
    distance,
    coordinates: { latitude, longitude }
  };
};

function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
```

---

## 7. Setting Up the Backend

```bash
# 1. Init project
mkdir nativeknows-backend && cd nativeknows-backend
npm init -y
npm install express prisma @prisma/client cors helmet express-rate-limit jsonwebtoken bcryptjs dotenv zod

# 2. Init Prisma
npx prisma init

# 3. Add DATABASE_URL to .env (from Supabase)
DATABASE_URL="postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres"

# 4. Push schema to database
npx prisma db push

# 5. Run migrations
npx prisma migrate dev --name init
```

**Backend entry point:**
```javascript
// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import spotsRouter from './routes/spots';
import alertsRouter from './routes/alerts';
import usersRouter from './routes/users';
import { authMiddleware } from './middleware/auth';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGIN }));
app.use(express.json());

app.use('/v1/spots', spotsRouter);
app.use('/v1/alerts', alertsRouter);
app.use('/v1/users', authMiddleware, usersRouter);

app.listen(3000, () => console.log('NativeKnows API running on :3000'));
```

**Trap Score Algorithm:**
```javascript
// src/services/trapScoreService.ts
export const calculateTrapScore = (spot: SpotWithReviews): number => {
  let score = 0;

  // Factor 1: Price variance (0-35 points)
  if (spot.priceVariance) {
    score += Math.min(35, spot.priceVariance * 0.4);
  }

  // Factor 2: Tourist review ratio (0-25 points)
  const touristReviewRatio = spot.reviews.filter(r => r.user.userType === 'TOURIST').length / spot.reviews.length;
  score += touristReviewRatio * 25;

  // Factor 3: Rating spike detection (0-20 points)
  const recentRating = getRecentAvgRating(spot.reviews, 30); // last 30 days
  const overallRating = spot.rating;
  if (recentRating - overallRating > 0.5) score += 20;

  // Factor 4: Number of scam reports (0-20 points)
  score += Math.min(20, spot.reports.length * 4);

  return Math.min(100, Math.round(score));
};
```

---

## 8. Frontend Setup

```bash
# Install Expo CLI
npm install -g @expo/cli

# Create project
npx create-expo-app NativeKnows --template blank-typescript
cd NativeKnows

# Install dependencies
npx expo install expo-router react-native-maps expo-location expo-image-picker
npm install zustand axios @supabase/supabase-js nativewind

# Start development server
npx expo start
```

**Convert the provided JSX prototype to React Native:**

The `NativeKnows_App.jsx` file in this repo is a **web prototype** (React + inline CSS). To build the actual mobile app, convert each screen to React Native components using `View`, `Text`, `TouchableOpacity`, `ScrollView`, `FlatList` instead of `div`, `button`, etc.

---

## 9. Authentication & User Roles

### Roles
- **TOURIST** — Default. Can view public spots, submit reviews, report scams.
- **LOCAL** — Verified by phone number + area code matching. Can access Locals Only spots.
- **ADMIN** — Can approve/reject submissions, manage trap scores.

### Verification Flow (Local users)
1. User selects "I'm a local" in Profile
2. App requests phone number (OTP via Supabase/Twilio)
3. App requests current location
4. If location matches claimed city → grant LOCAL status
5. Trust score starts at 70 (vs 50 for tourists)

---

## 10. Environment Variables

```env
# .env (backend)
DATABASE_URL=postgresql://...
JWT_SECRET=your_super_secret_key_here
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=your_service_key
CLOUDINARY_CLOUD_NAME=nativeknows
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GOOGLE_MAPS_API_KEY=your_maps_key
PORT=3000
NODE_ENV=production
ALLOWED_ORIGIN=https://nativeknows.app

# .env (mobile app)
EXPO_PUBLIC_API_URL=https://api.nativeknows.app/v1
EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
EXPO_PUBLIC_GOOGLE_MAPS_KEY=your_maps_key
```

---

## 11. GitHub Repository Setup

```bash
# 1. Create repo on GitHub named "nativeknows"

# 2. Clone and init
git clone https://github.com/YOUR_USERNAME/nativeknows.git
cd nativeknows

# 3. Set up monorepo structure
mkdir -p apps/mobile apps/web backend

# 4. Copy files into place, then:
git add .
git commit -m "feat: initial NativeKnows project structure"
git push origin main

# 5. Set up branch protection
# Settings → Branches → Add rule → main → Require PR reviews
```

**GitHub Actions CI:**
```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with: { node-version: '18' }
      - run: cd backend && npm ci && npm test

  lint-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with: { node-version: '18' }
      - run: cd apps/mobile && npm ci && npm run lint
```

---

## 12. Deployment Guide

### Backend (Railway)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up

# Add env variables via dashboard or:
railway variables set DATABASE_URL=...
```

### Mobile App (Expo EAS)
```bash
# Install EAS CLI
npm install -g eas-cli

# Configure builds
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios

# Submit to stores
eas submit --platform android
eas submit --platform ios
```

---

## 13. Revenue Model

| Stream | Description | Target Revenue |
|---|---|---|
| Premium Subscription | ₹99/month — unlock city guides, offline maps, advance alerts | Primary |
| Business "Fair Pricing" Badge | Verified businesses pay ₹500/month to display badge | Secondary |
| In-app deals | Commission on partner restaurant deals (10–15%) | Future |
| City licensing | White-label to tourism boards | Scale |

**No paid spot promotion. Ever.** This is a core promise.

---

## 14. Roadmap

### Phase 1 — MVP (Months 1–3)
- [ ] Core spot discovery (Discover screen)
- [ ] Submit spot with bill + GPS verification
- [ ] Scam alert reporting
- [ ] Basic user profiles + LocalPoints

### Phase 2 — Community (Months 4–6)
- [ ] Local Guides + following system
- [ ] Verified Local status flow
- [ ] Locals Only mode
- [ ] Trap Score algorithm live data

### Phase 3 — Monetization (Months 7–9)
- [ ] Premium subscription
- [ ] Business dashboard + Fair Pricing badge
- [ ] In-app deals & bookings

### Phase 4 — Scale (Months 10–12)
- [ ] Multi-city expansion (Mumbai, Jaipur, Goa)
- [ ] Personalized recommendations (ML)
- [ ] Partner with tourism boards

---

*Built with ❤️ for travelers who deserve the real thing.*
