from typing import TypedDict


class RowCounts(TypedDict):
    """How many rows of a kind there are, how many are open, and how many of those the user has not seen."""

    all: int
    open: int
    unread: int
