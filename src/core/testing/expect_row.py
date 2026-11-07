import sqlite3
from collections.abc import Mapping


def expect_row(row: object, **fields: object) -> None:
    actual = {name: row[name] if isinstance(row, Mapping | sqlite3.Row) else getattr(row, name) for name in fields}
    assert actual == fields, f"{row} holds {actual}, not {fields}"
