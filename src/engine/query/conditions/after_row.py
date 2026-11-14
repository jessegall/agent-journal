from dataclasses import dataclass

from engine.database.statement import Statement


@dataclass(frozen=True)
class AfterRow:
    """Matches the rows that come after a given row in an order by one column and then the key, as SQLite sorts
    them: an empty value first when ascending and last when descending, and rows with the same value by their key."""

    column: str
    descending: bool
    value: object
    key: str
    key_value: object
    key_descending: bool

    def statement(self) -> Statement:
        key_after = f"{self.key} {'<' if self.key_descending else '>'} ?"
        if self.value is None:
            return self.after_empty(key_after)
        past = f"{self.column} {'<' if self.descending else '>'} ?"
        tie = f"({self.column} = ? AND {key_after})"
        if self.descending:
            return Statement(f"({past} OR {self.column} IS NULL OR {tie})", [self.value, self.value, self.key_value])
        return Statement(f"({past} OR {tie})", [self.value, self.value, self.key_value])

    def after_empty(self, key_after: str) -> Statement:
        tie = f"({self.column} IS NULL AND {key_after})"
        if self.descending:
            return Statement(tie, [self.key_value])
        return Statement(f"({self.column} IS NOT NULL OR {tie})", [self.key_value])
