from dataclasses import dataclass


@dataclass(frozen=True)
class RequestTraceEntry:
    """One request in the developer's trace: its line, the role that asked, how long it ran and waited, its exit code
    and the body kept with it."""

    line: list[str]
    role: str
    duration_ms: float
    queued_ms: float
    code: int
    body: object
    starts_http_request: bool = False
