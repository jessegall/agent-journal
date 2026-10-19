from dataclasses import dataclass, field


@dataclass(frozen=True)
class ShareAnswer:
    """What the share server sends back: a status, the bytes, their media type and the headers of its own the answer needs."""

    status: int
    body: bytes = b""
    kind: str = "text/html; charset=utf-8"
    headers: dict = field(default_factory=dict)
