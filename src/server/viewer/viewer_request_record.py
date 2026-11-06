from dataclasses import dataclass

from core.base.database.points import Points
from server.viewer.viewer_line_request import ViewerLineRequest


@dataclass(frozen=True)
class ViewerHttpRequest:
    request_id: str
    received_at: str
    batch_id: str
    duration_ms: float
    payload_bytes: int
    person_id: int


@dataclass(frozen=True)
class ViewerRequestRecord:
    http: ViewerHttpRequest
    request: ViewerLineRequest
    child_index: int
    duration_ms: float
    queued_ms: float
    code: int
    points: Points | None = None
