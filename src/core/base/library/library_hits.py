from dataclasses import dataclass

from core.base.library.library_hit import LibraryHit


@dataclass(frozen=True)
class LibraryHits:
    """The items of the team's library that a search found, none when the library is not there to ask."""

    entries: tuple[LibraryHit, ...] = ()
