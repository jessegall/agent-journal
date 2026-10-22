from dataclasses import dataclass


@dataclass(frozen=True)
class RejectedField:
    """A field a push did not set, because the server holds a later edit of it or the row is gone: the row, the field, and the value and time that stand, the field empty when the whole row was deleted."""

    row_table: str
    row: int
    field: str
    value: object
    changed_at: float

    @classmethod
    def deleted_row(cls, row_table: str, row: int) -> "RejectedField":
        return cls(row_table, row, "", None, 0.0)
