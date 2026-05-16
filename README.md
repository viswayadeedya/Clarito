# Clarito

A visual learning canvas app where you can organise knowledge into workspaces and chapters, each backed by a full Excalidraw canvas. Draw diagrams, annotate concepts, and have your work auto-saved as you go.

---

## Features

- **Workspaces** — group related chapters together (e.g. a course, a project, a topic)
- **Chapters** — each chapter is an infinite Excalidraw canvas
- **Auto-save** — canvas state saves to the database every 3 seconds
- **Image support** — embed images on the canvas; they persist across reloads
- **Auth** — JWT-based sign up, login, forgot password, and reset password via email
- **Delete with confirmation** — workspace deletion requires typing the name to confirm; cascades to all chapters

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS v3, Excalidraw |
| Backend | FastAPI, SQLAlchemy (async), asyncpg |
| Database | PostgreSQL (Supabase) |
| Auth | JWT (python-jose), bcrypt |
| Email | fastapi-mail + Gmail SMTP |
| Deploy | Vercel (frontend), Railway (backend) |

---

## Project Structure

```
Clarito/
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   │   ├── auth.py         # register, login, forgot/reset password
│   │   │   ├── workspaces.py   # workspace CRUD
│   │   │   └── chapters.py     # chapter CRUD + canvas save
│   │   ├── auth.py             # JWT + bcrypt helpers
│   │   ├── config.py           # pydantic-settings env config
│   │   ├── database.py         # async SQLAlchemy engine
│   │   ├── email_service.py    # password reset emails
│   │   ├── models.py           # User, Workspace, Chapter
│   │   ├── schemas.py          # Pydantic request/response models
│   │   └── main.py             # FastAPI app + CORS + lifespan
│   ├── pyproject.toml
│   └── uv.lock
└── frontend/
    ├── public/
    │   └── favicon.svg
    ├── src/
    │   ├── api/client.js       # axios instance with JWT interceptor
    │   ├── components/
    │   │   └── ProtectedRoute.jsx
    │   └── pages/
    │       ├── Landing.jsx
    │       ├── Login.jsx
    │       ├── Register.jsx
    │       ├── ForgotPassword.jsx
    │       ├── ResetPassword.jsx
    │       ├── Dashboard.jsx   # workspace list
    │       ├── Workspace.jsx   # chapter list
    │       └── Canvas.jsx      # Excalidraw canvas
    ├── index.html
    └── vite.config.js
```

---

## Local Development

### Prerequisites

- Python 3.11+, [uv](https://github.com/astral-sh/uv)
- Node.js 18+
- A PostgreSQL database (Supabase free tier works)

### Backend

```bash
cd backend

# create .env
cp .env.example .env
# fill in your values (see Environment Variables below)

# install dependencies and run
uv sync
uv run uvicorn app.main:app --reload
```

API runs at `http://127.0.0.1:8000`. Docs at `http://127.0.0.1:8000/docs`.

### Frontend

```bash
cd frontend

# create local env
echo "VITE_API_URL=http://127.0.0.1:8000" > .env.local

npm install
npm run dev
```

App runs at `http://localhost:5173`.

---

## Environment Variables

### Backend — `backend/.env`

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (`postgresql+asyncpg://...`) |
| `SECRET_KEY` | Random hex string for signing JWTs |
| `FRONTEND_URL` | Frontend origin for CORS + reset email links |
| `MAIL_USERNAME` | Gmail address |
| `MAIL_PASSWORD` | Gmail App Password (not your account password) |
| `MAIL_FROM` | Sender address (usually same as `MAIL_USERNAME`) |
| `MAIL_SERVER` | `smtp.gmail.com` |
| `MAIL_PORT` | `587` |

> Generate a secret key: `python -c "import secrets; print(secrets.token_hex(32))"`

### Frontend — `frontend/.env.local`

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend base URL (e.g. `http://127.0.0.1:8000` locally) |

---

## Deployment

### Railway (Backend)

1. Create a new Railway project, connect this repo
2. Set **Root Directory** to `backend`
3. Set **Start Command** to:
   ```
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```
4. Add all backend environment variables in Railway's Variables tab
5. Set `FRONTEND_URL` to your Vercel app URL

### Vercel (Frontend)

1. Create a new Vercel project, connect this repo
2. Set **Root Directory** to `frontend`
3. Framework preset: **Vite**
4. Add environment variable:
   ```
   VITE_API_URL=https://your-app.up.railway.app
   ```

---

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Login, returns JWT |
| POST | `/auth/forgot-password` | Send reset email |
| POST | `/auth/reset-password` | Reset password with token |
| GET | `/workspaces/` | List user's workspaces |
| POST | `/workspaces/` | Create workspace |
| DELETE | `/workspaces/{id}` | Delete workspace + all chapters |
| GET | `/chapters/` | List user's chapters |
| POST | `/chapters/` | Create chapter |
| GET | `/chapters/{id}` | Get chapter |
| PATCH | `/chapters/{id}/canvas` | Save canvas state |
| DELETE | `/chapters/{id}` | Delete chapter |

---

## License

MIT
