import os
from dataclasses import dataclass

from dotenv import load_dotenv


load_dotenv()


@dataclass(frozen=True)
class Settings:
    bfl_api_key: str | None = os.getenv("BFL_API_KEY")
    bfl_endpoint: str = os.getenv("BFL_ENDPOINT", "https://api.bfl.ai/v1/flux-2-klein-4b")
    inswapper_path: str = os.getenv("INSWAPPER_PATH", "models/inswapper_128.onnx")
    log_file: str = os.getenv("API_LOG_FILE", "api_logs.txt")


settings = Settings()
