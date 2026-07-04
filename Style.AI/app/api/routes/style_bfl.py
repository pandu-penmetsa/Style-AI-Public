import time
import uuid

from fastapi import APIRouter, HTTPException

from app.logging import append_log
from app.schemas.style import HairStyleChangeBFLRequest, HairStyleChangeResponse
from app.services.bfl_service import call_bfl
from app.services.face_service import calculate_match_score, restore_face, restore_face_from_detected_faces
from app.services.image_service import base64_to_image, image_to_base64, url_to_image


router = APIRouter()


@router.post("/api/change-style-bfl", response_model=HairStyleChangeResponse)
async def change_hairstyle_bfl(request: HairStyleChangeBFLRequest):
    request_id = str(uuid.uuid4())
    total_start = time.time()

    try:
        append_log(f"--- NEW BFL REQUEST: Threshold={request.match_score_threshold}% ---", request_id)

        user_img = base64_to_image(request.user_image_url)
        generated_img, bfl_elapsed = call_bfl(
            request.user_image_url,
            request.reference_image_url,
            request_id,
            request.style_type,
        )

        match_score, match_elapsed, faces1, faces2 = calculate_match_score(user_img, generated_img, request_id)

        restoration_time = 0.0
        face_restoration_applied = False
        if match_score < request.match_score_threshold:
            append_log(
                f"Match Score {match_score:.2f}% < {request.match_score_threshold}% - Applying Face Restoration...",
                request_id,
            )
            generated_img, restoration_time = restore_face_from_detected_faces(faces1, faces2, generated_img, request_id)
            face_restoration_applied = True
        else:
            append_log(
                f"Match Score {match_score:.2f}% >= {request.match_score_threshold}% - No Restoration Needed",
                request_id,
            )

        result_base64 = image_to_base64(generated_img)
        total_elapsed = time.time() - total_start
        append_log(f"Total Processing Time: {total_elapsed:.2f}s", request_id)

        return HairStyleChangeResponse(
            status="success",
            result_image_base64=result_base64,
            match_score=match_score,
            face_restoration_applied=face_restoration_applied,
            processing_time=total_elapsed,
            bfl_time=bfl_elapsed,
            match_score_time=match_elapsed,
            restoration_time=restoration_time,
        )
    except Exception as exc:
        err_msg = f"Error: {type(exc).__name__} - {str(exc)}"
        append_log(err_msg, request_id)
        raise HTTPException(status_code=500, detail=err_msg) from exc


@router.post("/api/change-hairstyle-mock", response_model=HairStyleChangeResponse)
async def change_hairstyle_bfl_mock(request: HairStyleChangeBFLRequest):
    request_id = str(uuid.uuid4())
    total_start = time.time()

    try:
        append_log(f"--- NEW BFL REQUEST: Threshold={request.match_score_threshold}% ---", request_id)

        user_img = base64_to_image(request.user_image_url)
        generated_img = base64_to_image(request.reference_image_url)

        match_score = 0.0
        append_log(
            f"Match Score {match_score:.2f}% < {request.match_score_threshold}% - Applying Face Restoration...",
            request_id,
        )
        generated_img, restoration_time = restore_face(user_img, generated_img, request_id)
        face_restoration_applied = True

        result_base64 = image_to_base64(generated_img)
        total_elapsed = time.time() - total_start
        append_log(f"Total Processing Time: {total_elapsed:.2f}s", request_id)

        return HairStyleChangeResponse(
            status="success",
            result_image_base64=result_base64,
            match_score=match_score,
            face_restoration_applied=face_restoration_applied,
            processing_time=total_elapsed,
            bfl_time=0,
            match_score_time=0,
            restoration_time=restoration_time,
        )
    except Exception as exc:
        err_msg = f"Error: {type(exc).__name__} - {str(exc)}"
        append_log(err_msg, request_id)
        raise HTTPException(status_code=500, detail=err_msg) from exc
