from dataclasses import dataclass

LIBRARY_PREFIX = "library:"


@dataclass(frozen=True)
class LibraryRef:
    """The number of an item on the team's shared server, written library:12 so it is never taken for the local row
    with the same number."""

    item_id: int

    @staticmethod
    def row_id(text: str) -> "int | LibraryRef":
        return LibraryRef(int(text.removeprefix(LIBRARY_PREFIX))) if text.startswith(LIBRARY_PREFIX) else int(text)
