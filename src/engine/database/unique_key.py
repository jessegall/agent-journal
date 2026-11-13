from dataclasses import dataclass


@dataclass(frozen=True)
class UniqueKey:
    """A unique index of the live schema: its table, the columns it keeps unique, and the condition a partial
    index holds only under ("1 = 1" for a whole one)."""

    table: str
    columns: tuple[str, ...]
    guarded: str
