from dataclasses import dataclass

from server.viewer.viewer_http_request import ViewerHttpRequest

from core.base.database.points import Points
from server.viewer.viewer_line_request import ViewerLineRequest


@dataclass(frozen=True)
class ViewerRequestRecord:
    http: ViewerHttpRequest
    request: ViewerLineRequest
    child_index: int
    duration_ms: float
    queued_ms: float
    code: int
    points: Points | None = None
