# Active Healing Mind

A pseudo-medical meditation and healing app using:
- 🎵 Binaural beats for deep meditation
- 🏥 Medical image comparison (injury vs. healthy body parts)
- 💊 Placebo/suggestion effect to promote pain relief and healing
- 📊 Progress tracking (pain levels over time)

Built on [Base44](https://base44.com).

---

## Project Structure

```
active-healing-mind/
├── entities/               # Database schema definitions
│   ├── Session.json        # Meditation session records
│   ├── PainTracking.json   # Pain level logs
│   └── User.json           # User profile
├── functions/              # Backend functions (Deno runtime)
│   ├── completeSession.ts      # Mark session complete + record pain data
│   ├── getProgressSummary.ts   # Fetch user progress stats
│   ├── getUserProfile.ts       # Get/create user profile
│   ├── createCheckout.ts       # Stripe checkout session
│   └── sendWeeklyTranscript.ts # Weekly email transcript
├── generate_binaural.py        # Binaural beat audio generator
└── generate_binaural_short.py  # Short preview generator
```

---

## Features

### Core App
- 6-step guided meditation session flow
- Binaural beats (real audio, 5 tracks: delta 1Hz, delta 2Hz, theta 4Hz, theta 6Hz, alpha 10Hz)
- Image upload + curated sample images for injury comparison
- Post-session pain level tracking (before/after)
- Progress chart (pain trend over time)
- Bottom navigation bar
- Onboarding screen (6 animated slides)
- User authentication with per-user data isolation

### Monetization (Freemium)
- Ad-supported free tier
- Premium upgrade via Stripe (ad-free + unlimited sessions)

### Automations
- Weekly session reminder (Sundays 9:00am Tokyo)
- Weekly transcript email (Sundays 9:30am Tokyo → wandermike@gmail.com)

---

## Backend Functions

| Function | Endpoint | Description |
|---|---|---|
| `completeSession` | POST | Marks session done, records pain data |
| `getProgressSummary` | GET | Returns pain trend + session count |
| `getUserProfile` | GET | Returns or creates user profile |
| `createCheckout` | POST | Creates Stripe checkout session |
| `sendWeeklyTranscript` | POST | Sends weekly email report |

---

## Audio Tracks

| File | Type | Frequency |
|---|---|---|
| `sleep_delta_1hz.wav` | Delta | 1 Hz |
| `healing_delta_2hz.wav` | Delta | 2 Hz |
| `stress_theta_4hz.wav` | Theta | 4 Hz |
| `relaxation_theta_6hz.wav` | Theta | 6 Hz |
| `focus_alpha_10hz.wav` | Alpha | 10 Hz |

---

## Status

- ✅ Backend functions deployed
- ✅ Database entities configured
- ✅ Binaural audio generated and hosted
- ✅ Freemium ad framework built
- ⏳ UI testing pending (PC access)
- ⏳ Google AdSense integration (swap placeholders)
- ⏳ Stripe live keys (after full testing)
