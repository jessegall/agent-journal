import json
from collections.abc import Sequence
from dataclasses import fields, is_dataclass
from typing import TextIO

from engine.text.explanation import Explanation
from engine.guard.errors.guard_refusal import GuardRefusal
from engine.row.metadata import Metadata
from engine.model.model import Model
from engine.model.table import stored
from engine.model.tables import Tables
from engine.row.page import Page
from engine.errors.refusal import Refusal
from engine.types.type_guards import is_frozenset, is_mapping, is_tuple

LIST_HIDDEN_COLUMNS = ("version", "metadata", "created_at", "updated_at", "creator_id", "environment_id")


class Output:
    """Prints what a command gives back: plain lines for a user, or one JSON value with --json. A row a
    write gave back prints as the confirmation of what that write touched."""

    def __init__(self, tables: Tables, json_output: bool, stream: TextIO) -> None:
        self.tables, self.json_output, self.stream = tables, json_output, stream
        self.confirmation = ""

    # the reader of a streamed answer that hung up, such as a terminal stopped with Ctrl+C
    def has_reader_disconnected(self) -> bool:
        return self.stream.closed

    def line(self, text: str) -> None:
        self.write(text, {"line": text})

    def row(self, record: object) -> None:
        values = {**self.values(record), **self.properties(record)}
        is_confirmed = isinstance(record, Model) and bool(self.confirmation)
        self.write(self.confirmation if is_confirmed else "\n".join(f"{column}: {value}" for column, value in values.items() if value not in (None, {}, "")), values)

    def page(self, page: Page[object], columns: Sequence[str] = ()) -> None:
        rows = [{**self.values(record), **self.listed_properties(record)} for record in page.rows]
        lines = ["  ".join(str(value) for column, value in row.items() if (column in columns if columns else column not in LIST_HIDDEN_COLUMNS) and is_shown(value))
                 for row in rows]
        if not page.is_last:
            lines.append(f"page {page.number}, {len(page.rows)} of {page.total} rows: --page {page.number + 1} for the next")
        listing = {"rows": rows, "page": page.number, "size": page.size, "total": page.total}
        self.write("\n".join(lines) if lines else "nothing found", listing)

    def refusal(self, refusal: Refusal) -> None:
        guard_details = {"guard": refusal.guard, "skip_flag": refusal.skip_flag} if isinstance(refusal, GuardRefusal) else {"guard": "", "skip_flag": ""}
        self.write(refusal.text, {"refused": refusal.reason, "suggestion": refusal.suggestion, **guard_details})

    def explanation(self, explanation: Explanation) -> None:
        self.write("\n".join(explanation.lines()), explanation.data())

    def error(self, text: str) -> None:
        self.write(text, {"error": text})

    def values(self, record: object) -> dict[str, object]:
        if isinstance(record, Model):
            hidden = type(record).hidden_fields
            return {column: self.json_value(getattr(record, column)) for column in self.tables.table(type(record)).columns if column not in hidden}
        if is_dataclass(record) and not isinstance(record, type):
            return {record_field.name: self.json_value(getattr(record, record_field.name)) for record_field in fields(record)}
        return {"value": self.json_value(record)}

    def properties(self, record: object) -> dict[str, object]:
        return {name: self.json_value(getattr(record, name)) for name in type(record).shown_properties} if isinstance(record, Model) else {}

    def listed_properties(self, record: object) -> dict[str, object]:
        return {name: self.json_value(getattr(record, name)) for name in type(record).listed_properties} if isinstance(record, Model) else {}

    def json_value(self, value: object) -> object:
        if isinstance(value, bool):
            return value
        if isinstance(value, Metadata):
            return {module: dict(part) for module, part in value.values.items()}
        if is_frozenset(value):
            return sorted(str(item) for item in value)
        if is_mapping(value):
            return {str(key): self.json_value(item) for key, item in value.items()}
        if is_tuple(value):
            return [self.json_value(item) for item in value]
        return stored(value)

    def write(self, text: str, data: object) -> None:
        self.stream.write((json.dumps(data, sort_keys=True) if self.json_output else text) + "\n")


def is_shown(value: object) -> bool:
    return value is not None and value is not False and value != "" and value != {}


