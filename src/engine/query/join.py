from dataclasses import dataclass


@dataclass(frozen=True)
class Join:
    """One table a read joins, on a comparison of two columns, kept by an inner join or by a left join."""

    table: str
    left: bool
    first: str
    operator: str
    second: str

    @property
    def sql(self) -> str:
        return f"{'LEFT JOIN' if self.left else 'JOIN'} {self.table} ON {self.first} {self.operator} {self.second}"
