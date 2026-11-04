from argparse import Namespace
from dataclasses import dataclass

from core.base.library.library_item import LibraryItem


@dataclass(frozen=True)
class LibraryReading:
    """A document of the team's library with the reading flags it was asked for with."""

    item: LibraryItem
    arguments: Namespace
