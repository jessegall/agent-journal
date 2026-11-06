from dataclasses import dataclass


@dataclass(frozen=True)
class WorkContextFileContent:
    """The named attachment bytes returned by an explicit authorized file request."""

    name: str
    content_base64: str
    caption: str
