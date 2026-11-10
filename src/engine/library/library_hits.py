from dataclasses import dataclass

from engine.library.library_hit import LibraryHit


@dataclass(frozen=True)
class LibraryHits:
    """The items of the team's library that a search found; none when the library is not there to ask, and
    whether it was asked and could not be reached."""

    entries: tuple[LibraryHit, ...] = ()
    is_unreachable: bool = False
