from dataclasses import dataclass


@dataclass(frozen=True)
class FileAnswer:
    """The bytes of a file a message carries, and the type it is served as."""

    data: bytes
    content_type: str
