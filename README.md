# Style.AI Workspace

Style.AI is an AI-assisted style transformation project with two applications:

- `Style.AI`: FastAPI backend for BFL image generation, face matching, and optional face restoration.
- `Style.AI-UI`: React frontend for uploading a user photo, choosing a local hair or dress reference, and viewing generated results.

## Project Structure

```text
.
|-- Style.AI/      # Python FastAPI backend
`-- Style.AI-UI/   # React UI
```

## Backend

```powershell
cd Style.AI
uv sync
Copy-Item .env.example .env
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Backend docs:

- Swagger: `http://127.0.0.1:8000/docs`
- Health: `http://127.0.0.1:8000/health`
- BFL endpoint: `POST /api/change-style-bfl`
- Mock endpoint: `POST /api/change-hairstyle-mock`

Required backend configuration lives in `Style.AI/.env`.

## UI

```powershell
cd Style.AI-UI
npm install
npm start
```

The UI runs at `http://localhost:3000` by default and calls the backend configured in `src/services/styleApi.js`. Reference images live under `Style.AI-UI/public/reference-images/` and are sent to the backend as base64.

## Verification

Backend compile check:

```powershell
cd Style.AI
uv run python -m py_compile main.py Style_BFL.py app\main.py app\config.py app\logging.py app\core\prompts.py app\schemas\style.py app\services\image_service.py app\services\bfl_service.py app\services\face_service.py app\api\routes\style_bfl.py
```

UI production build:

```powershell
cd Style.AI-UI
npm run build
```
