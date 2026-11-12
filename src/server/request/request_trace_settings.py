from dataclasses import dataclass


@dataclass(frozen=True)
class RequestTraceSettings:
    """The enabled state and retention limit currently used by the server's request log."""

    enabled: bool = False
    limit: int = 0
