from argparse import Namespace
from dataclasses import dataclass

from engine.library.library_item import LibraryItem


@dataclass(frozen=True)
class LibraryReading:
    """An item of the team's library read live, with the reading flags it was asked for with."""

    item: LibraryItem
    arguments: Namespace
