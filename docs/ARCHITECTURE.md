# Active Healing Mind — Architecture Overview

## Backend (Base44)

### Entities (Database)
| Entity | Purpose |
|---|---|
| `User` | User profile, preferences, subscription status |
| `Session` | Each meditation session record (pain before/after, beat used) |
| `PainTracking` | Daily pain level logs with injury area and notes |

### Backend Functions (Deno)
| Function | Route | Auth |
|---|---|---|
| `completeSession` | POST `/completeSession` | Required |
| `getProgressSummary` | POST `/getProgressSummary` | Required |
| `getUserProfile` | POST `/getUserProfile` | Required |
| `createCheckout` | POST `/createCheckout` | Required |
| `sendWeeklyTranscript` | POST `/sendWeeklyTranscript` | Service role |

### Automations
| Name | Schedule | Action |
|---|---|---|
| Weekly session reminder | Sundays 9:00am Tokyo | Push notification / in-app reminder |
| Weekly transcript | Sundays 9:30am Tokyo | Email full transcript to wandermike@gmail.com |

## Frontend (Base44 App Builder)
- 6-step guided meditation flow
- Binaural beat player with waveform visualization
- Image upload + comparison UI
- Pain tracking input (before/after each session)
- Progress chart (pain trend over time)
- Onboarding (6 animated slides)
- Bottom navigation bar
- Upgrade/premium screen (Stripe)
- Ad placements (freemium tier)

## Monetization
- **Free tier:** Ad-supported, limited sessions
- **Premium:** One-time or subscription via Stripe, ad-free, unlimited
