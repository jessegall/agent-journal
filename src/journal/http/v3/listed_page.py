from typing import TypedDict


class ListedPage(TypedDict):
    """One page of rows as the viewer lists them, and whether older ones are left."""

    rows: list[dict]
    more: bool
