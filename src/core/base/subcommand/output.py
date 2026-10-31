import json
from dataclasses import fields, is_dataclass
from typing import TextIO

from core.base.guard.explanation import Explanation
from core.base.guard.guard_refusal import GuardRefusal
from core.base.metadata import Metadata
from core.base.model.model import Model
from core.base.model.table import stored
from core.base.model.tables import Tables
from core.base.page import Page
from core.base.refusal import Refusal
from core.base.type_guards import is_frozenset, is_mapping, is_tuple

LIST_HIDDEN_COLUMNS = ("version", "metadata", "created_at", "updated_at", "creator_id", "environment_id")


class Output:
    """Prints what a command gives back: plain lines for a person, or one JSON value with --json."""

    def __init__(self, tables: Tables, json_output: bool, stream: TextIO) -> None:
        self.tables, self.json_output, self.stream = tables, json_output, stream

    def line(self, text: str) -> None:
        self.write(text, {"line": text})

    def row(self, record: object) -> None:
        values = self.values(record)
        self.write("\n".join(f"{column}: {value}" for column, value in values.items() if value not in (None, {}, "")), values)

    def page(self, page: Page[object]) -> None:
        lines = ["  ".join(str(value) for column, value in self.values(record).items() if column not in LIST_HIDDEN_COLUMNS and is_shown(value))
                 for record in page.rows]
        if not page.is_last:
            lines.append(f"page {page.number}, {len(page.rows)} of {page.total} rows: --page {page.number + 1} for the next")
        listing = {"rows": [self.values(record) for record in page.rows], "page": page.number, "size": page.size, "total": page.total}
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


