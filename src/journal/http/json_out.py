import json
from dataclasses import fields, is_dataclass
from datetime import datetime
from enum import Enum

from journal.http.model_fields import ModelFields
from journal.support.actor import Actor
from journal.models.model import Model
from journal.support.ref import Ref


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
        if isinstance(value, Model):
            return ModelFields.of(value)
        if is_dataclass(value):
            return {field.name: getattr(value, field.name) for field in fields(value)}
        return super().default(value)
