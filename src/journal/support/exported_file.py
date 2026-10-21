from dataclasses import dataclass


@dataclass(frozen=True)
class ExportedFile:
    """A row written out as a file to download: its name, its media type and its bytes."""

    name: str
    kind: str
    body: bytes
