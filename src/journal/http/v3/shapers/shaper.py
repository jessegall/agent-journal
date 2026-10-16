from journal.http.v3.v3_row import V3Row


class Shaper:
    """One version 3 type: which version 4 rows it is read from, and the row each becomes. A type with no rows of its own answers none."""

    type: str

    def rows(self) -> list[V3Row]:
        return []

    def count_all(self) -> int:
        return len(self.rows())
