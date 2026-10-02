# Shariq Portfolio

Standalone local version of the deployed Muhammad Shariq Shakeel portfolio. The visual layout, content, animations, profile resources, projects, skills, experience, navigation, contact modal, and social links are kept aligned with the live portfolio.

## Run locally

1. Install **Node.js 18+** (Node 20+ is recommended).
2. Open this folder in VS Code.
3. Open `.env`.
4. Put a **new Resend Sending Access API key** after `RESEND_API_KEY=`. Do not use an API key that has been exposed in chat, screenshots, or source control.
5. If you have a verified Resend domain, set `RESEND_FROM_EMAIL` to a sender on that domain. Otherwise the included `onboarding@resend.dev` sender is intended for Resend testing and is subject to Resend's sending restrictions.
6. Run:

```powershell
npm install
npm run dev
```

7. Open **http://localhost:3000**.
   Note:The local host address could vary based on different conditions.

The contact form sends to **shariqofficial6@gmail.com** through the local `/api/contact` route and Resend. Provider errors are shown in the form instead of the generic message when Resend returns a useful error.

## Production-style local run

```powershell
npm install
npm run build
npm start
```

Then open **http://localhost:3000**.

## Important security note

The ZIP intentionally does **not** contain a real Resend API key. The `.env` file contains an empty placeholder so the project can start safely. Keep the real key only in your local `.env` and never commit it.
