import time

import cv2
import numpy as np
import requests

from app.config import settings
from app.core.prompts import DRESS_TRY_ON_PROMPT, HAIRSTYLE_PROMPT
from app.logging import append_log


def call_bfl(user_image_url: str, reference_image_url: str, request_id: str, style_type: str) -> tuple[np.ndarray, float]:
    if not settings.bfl_api_key:
        raise ValueError("BFL_API_KEY is not configured")

    start_time = time.time()
    append_log("Calling BFL API...", request_id)

    response = requests.post(
        settings.bfl_endpoint,
        headers={
            "accept": "application/json",
            "x-key": settings.bfl_api_key,
            "Content-Type": "application/json",
        },
        json={
            "prompt": HAIRSTYLE_PROMPT if style_type == "hair" else DRESS_TRY_ON_PROMPT,
            "input_image": user_image_url,
            "input_image_2": reference_image_url,
        },
        timeout=60,
    )
    response.raise_for_status()

    polling_url = response.json()["polling_url"]
    append_log("BFL request submitted, polling URL obtained.", request_id)

    while True:
        poll_response = requests.get(
            polling_url,
            headers={
                "accept": "application/json",
                "x-key": settings.bfl_api_key,
            },
            timeout=60,
        )
        poll_response.raise_for_status()

        poll_json = poll_response.json()
        status = poll_json.get("status")
        if status == "Ready":
            break
        if status == "Failed":
            raise RuntimeError(f"BFL processing failed: {poll_json}")

        time.sleep(2)

    image_url = poll_json["result"]["sample"]
    image_response = requests.get(image_url, timeout=60)
    image_response.raise_for_status()

    image_array = np.frombuffer(image_response.content, np.uint8)
    generated_image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    if generated_image is None:
        raise ValueError("Failed to decode generated image from BFL result")

    elapsed = time.time() - start_time
    append_log(f"BFL generation completed (took {elapsed:.2f}s)", request_id)
    return generated_image, elapsed
