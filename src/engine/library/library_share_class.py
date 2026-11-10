from typing import Protocol


class LibraryShareClass(Protocol):
    """What a module declares of a way of sharing rows: the name it has on the server."""

    name: str
