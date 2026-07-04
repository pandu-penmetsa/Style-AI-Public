from typing import Literal

from pydantic import BaseModel


class HairStyleChangeBFLRequest(BaseModel):
    user_image_url: str
    reference_image_url: str
    match_score_threshold: float = 80.0
    style_type: Literal["hair", "dress"]


class HairStyleChangeResponse(BaseModel):
    status: str
    result_image_base64: str
    match_score: float
    face_restoration_applied: bool
    processing_time: float
    bfl_time: float
    match_score_time: float
    restoration_time: float
