from journal.http.v3.listed_rows import ListedRows
from journal.http.v3.listing import Listing
from journal.http.v3.row_counts import RowCounts
from journal.http.v3.v3_row import USER, V3Row


class Shaper:
    """One version 3 type: which version 4 rows it is read from, and the row each becomes. A type with no rows of its own answers none."""

    type: str

    def rows(self) -> list[V3Row]:
        return []

    def answer(self, listing: Listing) -> ListedRows:
        """The page the listing asks for and the type's counts, from every row; a type with many rows answers from queries of its own."""
        rows = self.rows()
        return ListedRows(**listing.listed(rows), counts=self.counted(rows))

    @staticmethod
    def counted(rows: list[V3Row]) -> RowCounts:
        open_ = [r for r in rows if r.is_open]
        return RowCounts(all=len(rows), open=len(open_), unread=len([r for r in open_ if USER not in r.seen]))

    def count_all(self) -> int:
        return len(self.rows())
