import json
from dataclasses import asdict, dataclass, is_dataclass
from datetime import datetime
from enum import Enum
from types import UnionType
from typing import Union, get_args, get_origin

from journal.support.actor import Actor
from journal.support.ref import Ref


@dataclass(frozen=True)
class Column:
    """One model field as the database holds it: its SQL type, and the value both ways."""

    PLAIN = (bool, int, float, str, datetime, Actor, Ref)

    name: str
    kind: type

    @classmethod
    def of(cls, name: str, annotation) -> "Column":
        return cls(name, cls._bare(annotation))

    @property
    def sql_type(self) -> str:
        if self.kind is bool or self.kind is int:
            return "INTEGER"
        if self.kind is float:
            return "REAL"
        return "TEXT"

    @property
    def is_enum(self) -> bool:
        return isinstance(self.kind, type) and issubclass(self.kind, Enum)

    @property
    def is_json(self) -> bool:
        return self.kind not in self.PLAIN and not self.is_enum

    def to_sql(self, value):
        if value is None:
            return None
        if self.is_json:
            return json.dumps(asdict(value) if is_dataclass(value) else value)
        if isinstance(value, Actor):
            return value.stamp
        if isinstance(value, Ref):
            return str(value)
        if isinstance(value, datetime):
            return value.isoformat()
        if isinstance(value, Enum):
            return value.value
        if isinstance(value, bool):
            return int(value)
        if isinstance(value, (int, float, str)):
            return value
        return json.dumps(value)

    def from_sql(self, value):
        if value is None:
            return None
        if self.kind is Actor:
            return Actor.parse(value)
        if self.kind is Ref:
            return Ref.parse(value)
        if self.kind is datetime:
            return datetime.fromisoformat(value)
        if self.is_enum:
            return self.kind(value)
        if self.kind is bool:
            return bool(value)
        if self.kind in (int, float, str):
            return value
        loaded = json.loads(value)
        if is_dataclass(self.kind):
            return self.kind.from_json(loaded)
        return tuple(loaded) if self.kind is tuple else loaded

    @staticmethod
    def _bare(annotation) -> type:
        origin = get_origin(annotation)
        if origin in (Union, UnionType):
            return Column._bare(next(arg for arg in get_args(annotation) if arg is not type(None)))
        if origin is not None:
            return origin
        return annotation if isinstance(annotation, type) else object
