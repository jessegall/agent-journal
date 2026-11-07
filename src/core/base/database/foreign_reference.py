from dataclasses import dataclass


@dataclass(frozen=True)
class ForeignReference:
    """A foreign-key column that prevents deleting a referenced row."""

    table_name: str
    column_name: str
    target_column: str
