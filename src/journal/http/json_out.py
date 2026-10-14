import json
from dataclasses import fields, is_dataclass
from datetime import datetime
from enum import Enum

from journal.models.actor import Actor
from journal.models.ref import Ref


class JsonOut(json.JSONEncoder):
    """Writes models and their values as the viewer reads them."""

    def default(self, value):
        if isinstance(value, Actor):
            return value.stamp
        if isinstance(value, Ref):
            return str(value)
        if isinstance(value, datetime):
            return value.isoformat()
        if isinstance(value, Enum):
            return value.value
        if is_dataclass(value):
            return {field.name: getattr(value, field.name) for field in fields(value)}
        return super().default(value)
