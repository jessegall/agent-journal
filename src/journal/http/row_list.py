from typing import TypedDict

from journal.http.counts import Counts


class RowList(TypedDict):
    """One page of a resource's rows, whether older ones are left, and the resource's counts."""

    rows: list
    is_last_page: bool
    counts: Counts
