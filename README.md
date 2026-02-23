# TutorOps – Chrome Extension

A lightweight Chrome extension for managing tutoring session reports directly from Google Sheets.

## Features

- Auto-detect student names (dropdown)
- Generate unpaid session report
- Format sessions as:  
  `7pm-8pm 2/3/2026`
- Automatically calculate:
  - Total Hours
  - Total Earnings
- Mark sessions as paid (writes `1` to "Paid?" column)
- Copy report to clipboard

---

## Setup Instructions

### 1️⃣ Google Cloud Setup

1. Go to: https://console.cloud.google.com/
2. Create a new project (e.g., **TutorOps**)
3. Enable **Google Sheets API**
4. Configure OAuth Consent Screen:
   - User Type: External
   - Add yourself as a Test User
5. Create OAuth Client ID:
   - Application Type: Chrome Extension
   - Paste your extension ID
6. Copy the generated `client_id`

---

### 2️⃣ Configure Extension

Open `manifest.json` and paste your OAuth client ID:

```json
"oauth2": {
  "client_id": "YOUR_CLIENT_ID.apps.googleusercontent.com",
  "scopes": [
    "https://www.googleapis.com/auth/spreadsheets"
  ]
}