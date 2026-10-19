from typing import TypedDict

from journal.http.v3.row_counts import RowCounts


class ListedRows(TypedDict):
    """One page of a type's rows as the viewer lists them, whether older ones are left, and the type's counts."""

    rows: list[dict]
    more: bool
    counts: RowCounts
