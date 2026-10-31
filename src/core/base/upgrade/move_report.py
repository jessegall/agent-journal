from dataclasses import dataclass, field


@dataclass
class MoveReport:
    """What one move did, counted per table: rows moved, rows an earlier run moved, and the rows of a table it
    knowingly left."""

    moved: dict[str, int] = field(default_factory=lambda: {})
    repeated: dict[str, int] = field(default_factory=lambda: {})
    dropped: dict[str, int] = field(default_factory=lambda: {})

    def count(self, table: str, is_new: bool) -> None:
        counts = self.moved if is_new else self.repeated
        counts[table] = counts.get(table, 0) + 1

    def drop(self, table: str, rows: int) -> None:
        self.dropped[table] = self.dropped.get(table, 0) + rows

    def plus(self, addition: "MoveReport") -> "MoveReport":
        total = MoveReport(dict(self.moved), dict(self.repeated), dict(self.dropped))
        for counts, extra in ((total.moved, addition.moved), (total.repeated, addition.repeated), (total.dropped, addition.dropped)):
            for table, rows in extra.items():
                counts[table] = counts.get(table, 0) + rows
        return total
