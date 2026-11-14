from enum import StrEnum


class LinkSide(StrEnum):
    """The requested end of a relation read."""

    SOURCE = "source"
    TARGET = "target"
    ROW = "row"
