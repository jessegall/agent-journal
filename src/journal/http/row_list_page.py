from typing import TypedDict


class RowListPage(TypedDict):
    """One page of rows as the viewer lists them, and whether older ones are left."""

    rows: list
    more: bool
