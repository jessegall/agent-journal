from typing import TypedDict


class ProjectEntry(TypedDict):
    """A file or folder of the project as the viewer lists it."""

    path: str
    name: str
    folder: bool
