import base64

import cv2
import numpy as np
import requests


def url_to_image(url: str) -> np.ndarray:
    response = requests.get(url, timeout=60)
    response.raise_for_status()

    image_array = np.frombuffer(response.content, np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError(f"Failed to decode image from URL: {url}")

    return image


def image_to_base64(image: np.ndarray) -> str:
    success, buffer = cv2.imencode(".jpg", image)
    if not success:
        raise ValueError("Failed to encode image")

    return base64.b64encode(buffer).decode("utf-8")


def base64_to_image(base64_str: str) -> np.ndarray:
    image_data = base64.b64decode(base64_str)
    image_array = np.frombuffer(image_data, np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError("Failed to decode base64 image")

    return image
