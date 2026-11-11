from enum import IntEnum


class ReaderLayer(IntEnum):
    """Where a reader comes from, in the order a matching reader is chosen: the project's first, then a plugin's,
    then the readers the journal ships."""

    PROJECT = 0
    PLUGIN = 1
    STOCK = 2
