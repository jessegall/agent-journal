from dataclasses import dataclass


@dataclass(frozen=True)
class FileResponse:
    """A file's bytes with their media type, where a Response would be JSON."""

    kind: str
    body: bytes
    status: int = 200

    def headers(self) -> dict:
        return {}
