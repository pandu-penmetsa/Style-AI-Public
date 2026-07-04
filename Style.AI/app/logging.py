import logging
from logging.handlers import RotatingFileHandler

from app.config import settings


logger = logging.getLogger("style_ai")
logger.setLevel(logging.INFO)
logger.propagate = False

if not logger.handlers:
    handler = RotatingFileHandler(
        settings.log_file,
        maxBytes=1_000_000,
        backupCount=3,
        encoding="utf-8",
    )
    handler.setFormatter(logging.Formatter("[%(asctime)s] %(message)s", "%Y-%m-%d %H:%M:%S"))
    logger.addHandler(handler)


def append_log(message: str, request_id: str | None = None) -> None:
    if request_id:
        logger.info("[%s] %s", request_id, message)
        return

    logger.info(message)
