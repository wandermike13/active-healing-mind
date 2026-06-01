# Push Notification Strategy — Active Healing Mind

## Overview
Push notifications drive session consistency — the single biggest factor
in whether users see real pain improvement results.

---

## Notification Types

### 1. Weekly Session Reminder (Already live via automation)
- **Schedule:** Sundays 9:00am (user local time)
- **Message:** "Time for your healing session 🧘 Your body will thank you."
- **Action:** Opens directly to session start screen

### 2. Streak Encouragement
- **Trigger:** User has a 3+ day active streak
- **Message:** "🔥 {N}-day streak! Keep the momentum going."
- **Action:** Opens session screen

### 3. Streak at Risk
- **Trigger:** User hasn't completed a session today and had one yesterday
- **Time:** 7:00pm user local time
- **Message:** "Don't break your streak! A quick session takes just 10 minutes."
- **Action:** Opens session screen

### 4. Milestone Reached
- **Trigger:** completeSession returns a milestone value
- **Messages:**
  - Session 1: "Your healing journey has begun 🌱"
  - Session 7: "One week of healing sessions! You're building a habit 💪"
  - Session 30: "30 sessions! You're in the top 5% of users 🏆"

### 5. Pain Improvement Celebration
- **Trigger:** getProgressSummary shows overallImprovement >= 2 points
- **Message:** "Your pain is down {N} points since you started. Science is working. 🌟"
- **Frequency:** Once per threshold crossed (2pts, 4pts, 6pts)

### 6. Re-engagement (Lapsed users)
- **Trigger:** No session in 7 days
- **Message:** "We miss you. Even one session can reset your pain baseline."
- **Trigger:** No session in 14 days
- **Message:** "Your healing is still possible. Pick up where you left off."

---

## Implementation Notes

### iOS (APNs)
- Register for push in AppDelegate / SwiftUI App struct
- Request permission on onboarding step 3 (after user sees value)
- Store APNs token in User entity (`push_token` field)
- Backend function `sendPushNotification.ts` calls APNs HTTP/2 API

### Android (FCM)
- Firebase Cloud Messaging
- Register token via FirebaseMessaging.getInstance().token
- Store FCM token in User entity (`fcm_token` field)
- Same backend function handles both APNs and FCM via token type detection

### Entity Update Needed
Add to User schema:
- `push_token` (string) — APNs or FCM device token
- `push_enabled` (boolean) — user preference
- `last_session_date` (string) — for lapsed-user detection

---

## Next Steps
1. Add `push_token` and `push_enabled` fields to User entity
2. Build `sendPushNotification.ts` backend function
3. Create automation: daily check at 7pm for streak-at-risk users
4. Create automation: weekly check for lapsed users
