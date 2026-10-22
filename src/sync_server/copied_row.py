from dataclasses import dataclass


@dataclass(frozen=True)
class CopiedRow:
    """One row of the team's journal as the server holds it now: its table and number, its fields and when each was changed."""

    row_table: str
    row: int
    fields: dict
    changed_at: dict
