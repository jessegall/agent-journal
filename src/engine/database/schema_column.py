from dataclasses import dataclass


@dataclass(frozen=True)
class SchemaColumn:
    """A column of a table in the live schema, and the table its foreign key points at, if it has one."""

    table: str
    column: str
    target: str | None
