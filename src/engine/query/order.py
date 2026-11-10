from dataclasses import dataclass


@dataclass(frozen=True)
class Order:
    """The column to sort by and the direction."""

    column: str
    descending: bool

    @property
    def sql(self) -> str:
        return f"{self.column} {'DESC' if self.descending else 'ASC'}"
