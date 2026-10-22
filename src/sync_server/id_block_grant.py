from dataclasses import dataclass


@dataclass(frozen=True)
class IdBlockGrant:
    """A block of row numbers handed to a device for one table, first and last included."""

    row_table: str
    first: int
    last: int
