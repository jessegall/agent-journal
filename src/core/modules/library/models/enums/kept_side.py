from enum import StrEnum


class KeptSide(StrEnum):
    """Which version a user keeps when a copy and its item differ: the text of this journal, or the library's."""

    MINE = "mine"
    LIBRARY = "library"
