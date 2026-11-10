from dataclasses import dataclass, fields
from enum import StrEnum
from typing import ClassVar

from engine.time.timestamp import Timestamp
from engine.types.type_guards import is_tuple


@dataclass(frozen=True, kw_only=True)
class ViewModel:
    """A read-only row of a database view; the class names the view, its key column and its SELECT."""

    cli_name: ClassVar[str]
    view: ClassVar[str]
    key: ClassVar[str]
    select: ClassVar[str]
    shared_rows: ClassVar[bool] = False

    def json(self) -> dict[str, object]:
        return {field.name: json_value(getattr(self, field.name)) for field in fields(self)}


def json_value(value: object) -> object:
    if isinstance(value, Timestamp):
        return value.text
    if isinstance(value, StrEnum):
        return value.value
    if is_tuple(value):
        return [json_value(item) for item in value]
    return value
