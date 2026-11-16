from dataclasses import dataclass, field


@dataclass
class RemovalCounts:
    """The rows a removal deleted and the rows it set a reference of to NULL, per table."""

    deleted: dict[str, int] = field(default_factory=dict)
    nulled: dict[str, int] = field(default_factory=dict)

    def add_deleted(self, table: str, count: int) -> None:
        if count:
            self.deleted[table] = self.deleted.get(table, 0) + count

    def add_nulled(self, table: str, count: int) -> None:
        if count:
            self.nulled[table] = self.nulled.get(table, 0) + count

    def add(self, other: "RemovalCounts") -> None:
        for table, count in other.deleted.items():
            self.add_deleted(table, count)
        for table, count in other.nulled.items():
            self.add_nulled(table, count)
