# WARP SMPT

A small SMTP/email contact app consisting of a Vite React client and a Node/Express server to send emails. This repo contains a client UI, server logic, and utilities for sending email.

Demo: Run the server and the client to test sending an email via the contact form. (Demo line is intentionally short and visible here.)

## Features
- Simple contact form in React (Vite)
- Server-side email handling using Node/Express
- Utilities to send email (e.g., `sendMail.js`)

## Quick Start
1. Install dependencies for root, client, and server:

```powershell
cd "C:\Users\HP\Desktop\project\Nov 2025\WARP SMPT"
npm install
cd client
npm install
cd ..\server
npm install
```

2. Add environment variables (create `.env` files):

- `server/.env` - SMTP config, e.g.:
```
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-email-password
```
- `client/.env` if needed (for API base URL, etc.)

3. Run the server and client in separate terminals:

```powershell
# terminal 1 - server
cd server
npm run dev

# terminal 2 - client
cd client
npm run dev
```

4. Open the client (often `http://localhost:5173`) and submit the contact form to send a test email.

## Project Structure
```
client/ - Vite React client
server/ - Node/Express backend
controllers/ - server controllers (e.g., `mailController.js`)
utils/ - sendMail utilities
```

## Demo
- Demo: Use the contact form in the client or call the server endpoint `POST /api/mail` to send a sample email.

## Contributing
- Please use `.env.example` files to share required environment variables in a safe way.

## License
MIT
