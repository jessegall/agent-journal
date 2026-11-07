from dataclasses import dataclass


@dataclass(frozen=True)
class RequestLogEntry:
    line: list[str]
    role: str
    duration_ms: float
    queued_ms: float
    code: int
    body: object
