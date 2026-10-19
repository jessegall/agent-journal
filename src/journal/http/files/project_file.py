from typing import TypedDict


class ProjectFile(TypedDict):
    """A file of the project as the viewer opens it: its path, whether it is text, its size and lines, and the text."""

    path: str
    kind: str
    size: int
    lines: int
    text: str
