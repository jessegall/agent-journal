from dataclasses import dataclass


@dataclass(frozen=True)
class ViewerHttpRequest:
    request_id: str
    received_at: str
    batch_id: str | None
    duration_ms: float
    payload_bytes: int
    person_id: int
