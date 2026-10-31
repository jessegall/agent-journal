from dataclasses import dataclass


@dataclass(frozen=True)
class MovedRow:
    """One row moved from version 4: its version 4 table and number and the version 5 table and number it has."""

    old_table: str
    old_id: int
    new_table: str
    new_id: int
