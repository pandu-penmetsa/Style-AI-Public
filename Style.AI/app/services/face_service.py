import time
from typing import Any

import numpy as np
from insightface.app import FaceAnalysis
from insightface.model_zoo import get_model

from app.config import settings
from app.logging import append_log


face_app: FaceAnalysis | None = None
swapper: Any | None = None


def get_face_app() -> FaceAnalysis:
    global face_app

    if face_app is None:
        face_app = FaceAnalysis(name="buffalo_l", providers=["CPUExecutionProvider"])
        face_app.prepare(ctx_id=-1, det_size=(640, 640))

    return face_app


def get_swapper() -> Any:
    global swapper

    if swapper is None:
        swapper = get_model(settings.inswapper_path, providers=["CPUExecutionProvider"])

    return swapper


def calculate_match_score(customer_img: np.ndarray, generated_img: np.ndarray, request_id: str) -> tuple[float, float, list[Any], list[Any]]:
    start_time = time.time()
    app = get_face_app()

    faces1 = app.get(customer_img)
    faces2 = app.get(generated_img)

    if len(faces1) == 0:
        raise ValueError("No face found in user image")
    if len(faces2) == 0:
        raise ValueError("No face found in generated image")

    embedding1 = faces1[0].normed_embedding
    embedding2 = faces2[0].normed_embedding
    similarity = np.dot(embedding1, embedding2)
    match_score = max(0, min(100, similarity * 100))

    elapsed = time.time() - start_time
    append_log(f"Match Score Calculated: {match_score:.2f}% (took {elapsed:.2f}s)", request_id)
    return match_score, elapsed, faces1, faces2


def restore_face(customer_img: np.ndarray, generated_img: np.ndarray, request_id: str) -> tuple[np.ndarray, float]:
    start_time = time.time()
    app = get_face_app()

    original_faces = app.get(customer_img)
    generated_faces = app.get(generated_img)

    if len(original_faces) == 0:
        raise ValueError("No face found in user image for restoration")
    if len(generated_faces) == 0:
        raise ValueError("No face found in generated image for restoration")

    return restore_face_from_detected_faces(original_faces, generated_faces, generated_img, request_id, start_time)


def restore_face_from_detected_faces(
    original_faces: list[Any],
    generated_faces: list[Any],
    generated_img: np.ndarray,
    request_id: str,
    start_time: float | None = None,
) -> tuple[np.ndarray, float]:
    if start_time is None:
        start_time = time.time()

    if len(original_faces) == 0:
        raise ValueError("No face found in user image for restoration")
    if len(generated_faces) == 0:
        raise ValueError("No face found in generated image for restoration")

    result = get_swapper().get(generated_img, generated_faces[0], original_faces[0], paste_back=True)
    elapsed = time.time() - start_time
    append_log(f"Face Restoration Applied (took {elapsed:.2f}s)", request_id)
    return result, elapsed
