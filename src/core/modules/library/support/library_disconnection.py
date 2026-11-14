from dataclasses import dataclass


@dataclass(frozen=True)
class LibraryDisconnection:
    """What a disconnect did: how many copies it found, and whether it deleted them with the connection."""

    copies: int
    copies_deleted: bool
