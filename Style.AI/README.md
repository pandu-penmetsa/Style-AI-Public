# Style.AI

Style.AI is a FastAPI application for AI-assisted style transformations. The current API accepts a user image and a reference image, sends them to the BFL image generation API, validates identity similarity with InsightFace, and optionally restores the user's face into the generated result when the match score is below the configured threshold.

The project uses [uv](https://docs.astral.sh/uv/) for Python package management and lockfile-based dependency resolution.

## Features

- FastAPI backend with automatic OpenAPI documentation.
- Hairstyle transfer endpoint using BFL image generation.
- Dress/saree try-on prompt support through the same BFL flow.
- Mock endpoint for local face-restoration testing.
- Face similarity scoring with InsightFace embeddings.
- Optional face restoration with an InsightFace swapper ONNX model.
- Base64 result image response.
- Rotating file logs for API processing events.

## Project Structure

```text
.
|-- app/
|   |-- api/
|   |   `-- routes/
|   |       `-- style_bfl.py
|   |-- core/
|   |   `-- prompts.py
|   |-- schemas/
|   |   `-- style.py
|   |-- services/
|   |   |-- bfl_service.py
|   |   |-- face_service.py
|   |   `-- image_service.py
|   |-- config.py
|   |-- logging.py
|   `-- main.py
|-- main.py
|-- Style_BFL.py
|-- pyproject.toml
|-- uv.lock
|-- .env.example
`-- .gitignore
```

### Important Files

- `app/main.py`: FastAPI application setup, CORS, health route, and router registration.
- `app/api/routes/style_bfl.py`: API endpoints for BFL generation and mock testing.
- `app/schemas/style.py`: Pydantic request and response models.
- `app/services/bfl_service.py`: BFL API request, polling, and generated image download logic.
- `app/services/face_service.py`: InsightFace model loading, face matching, and face restoration.
- `app/services/image_service.py`: Image download, base64 decoding, and base64 encoding helpers.
- `app/core/prompts.py`: Prompt text used for hairstyle and dress try-on generation.
- `app/config.py`: Environment-based runtime configuration.
- `main.py`: Compatibility runner that imports `app.main`.
- `Style_BFL.py`: Compatibility module that re-exports the style router.

## Requirements

- Python 3.11 or newer.
- uv package manager.
- A BFL API key.
- An InsightFace swapper model file, commonly named `inswapper_128.onnx`.

The swapper model is not included in this repository. Keep model files outside git or place them under `models/`, which is ignored by `.gitignore`.

## Setup

Install uv if it is not already installed:

```powershell
pip install uv
```

Install project dependencies:

```powershell
uv sync
```

Create your local environment file:

```powershell
Copy-Item .env.example .env
```

Update `.env`:

```env
BFL_API_KEY=your_bfl_api_key_here
BFL_ENDPOINT=https://api.bfl.ai/v1/flux-2-klein-4b
INSWAPPER_PATH=models/inswapper_128.onnx
API_LOG_FILE=api_logs.txt
```

## Running The Application

Start the API:

```powershell
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Open:

- API root: `http://127.0.0.1:8000`
- Health check: `http://127.0.0.1:8000/health`
- Swagger docs: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

## API Endpoints

### `GET /health`

Returns basic service health.

Response:

```json
{
  "status": "healthy"
}
```

### `POST /api/change-style-bfl`

Runs the full BFL generation flow, calculates the face match score, and applies face restoration when the match score is below `match_score_threshold`.

Request body:

```json
{
  "user_image_url": "base64_encoded_user_image",
  "reference_image_url": "base64_encoded_reference_image",
  "match_score_threshold": 80.0,
  "style_type": "hair"
}
```

`style_type` must be one of:

- `hair`
- `dress`

Response body:

```json
{
  "status": "success",
  "result_image_base64": "base64_encoded_result_image",
  "match_score": 92.5,
  "face_restoration_applied": false,
  "processing_time": 24.8,
  "bfl_time": 20.1,
  "match_score_time": 1.3,
  "restoration_time": 0.0
}
```

### `POST /api/change-hairstyle-mock`

Uses the reference image as the generated image and runs face restoration. This is useful for local testing of image decoding and InsightFace restoration without calling BFL.

The request and response shape are the same as `/api/change-style-bfl`.

## Packages Used

### Runtime Framework

- `fastapi`: Web framework used to define the API, request validation, response models, and OpenAPI documentation.
- `uvicorn`: ASGI server used to run the FastAPI application.
- `pydantic`: Data validation and serialization for request/response schemas.

### Image And AI Processing

- `opencv-python`: Image decoding, encoding, and OpenCV image array handling.
- `numpy`: Numerical array operations and face embedding similarity calculation.
- `insightface`: Face detection, face embedding extraction, and model-zoo integration.
- `onnxruntime`: CPU runtime used by InsightFace ONNX models.

### External API And Configuration

- `requests`: HTTP client used for BFL requests, polling, and image downloads.
- `python-dotenv`: Loads local environment variables from `.env`.

## Configuration

Configuration is read from environment variables in `app/config.py`.

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `BFL_API_KEY` | Yes | None | API key used for BFL requests. |
| `BFL_ENDPOINT` | No | `https://api.bfl.ai/v1/flux-2-klein-4b` | BFL generation endpoint. |
| `INSWAPPER_PATH` | Yes | `models/inswapper_128.onnx` | Path to the InsightFace swapper ONNX model. |
| `API_LOG_FILE` | No | `api_logs.txt` | Log file used by the rotating file logger. |

## Security Notes

- Never commit `.env`.
- Rotate any API key that has been pasted into chat, logs, screenshots, or committed history.
- Do not commit model files, generated images, logs, virtual environments, or Python cache folders.
- Be careful with public deployments: the current CORS policy allows all origins.

## Development Notes

Compile-check the project:

```powershell
uv run python -m py_compile main.py Style_BFL.py app\main.py app\config.py app\logging.py app\core\prompts.py app\schemas\style.py app\services\image_service.py app\services\bfl_service.py app\services\face_service.py app\api\routes\style_bfl.py
```

Inspect registered API paths:

```powershell
uv run python -c "from app.main import app; print(sorted(app.openapi()['paths'].keys()))"
```

## Before Publishing

- Add a license file, for example `MIT`, `Apache-2.0`, or another license that matches how you want others to use the project.
- Rotate the existing BFL API key before making the repository public.
- Consider adding automated tests and a CI workflow.
- Consider tightening CORS for production deployments.
- Consider adding request size limits and stronger validation for base64 image inputs.
- Consider documenting where users can obtain compatible InsightFace model files.
