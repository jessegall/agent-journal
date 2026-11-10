import sqlite3

from engine.types.type_guards import is_mapping


def expect_row(row: object, **fields: object) -> None:
    actual = {name: row_field(row, name) for name in fields}
    assert actual == fields, f"{row} holds {actual}, not {fields}"


def row_field(row: object, name: str) -> object:
    if isinstance(row, sqlite3.Row) or is_mapping(row):
        return row[name]
    return getattr(row, name)
