from collections.abc import Sequence
from dataclasses import dataclass
from types import UnionType
from typing import TypeVar, Union, get_args, get_origin

from core.base.model.model import Model
from core.base.model.move import Move


@dataclass(frozen=True)
class EventType:
    """One event a listener or guard declared by its type parameter: the class of the event and the model of its
    row, or no model for a system event."""

    event_class: type
    model: type[Model] | None

    @classmethod
    def declared(cls, subscriber: type, base: type) -> tuple["EventType", ...]:
        for owner in subscriber.__mro__:
            for parent in owner.__dict__.get("__orig_bases__", ()):
                origin, arguments = get_origin(parent), get_args(parent)
                if isinstance(origin, type) and issubclass(origin, base) and arguments and not isinstance(arguments[0], TypeVar):
                    return tuple(cls.parsed(argument) for argument in cls.alternatives(arguments[0]))
        return ()

    @staticmethod
    def alternatives(hint: object) -> tuple[object, ...]:
        return get_args(hint) if get_origin(hint) in (Union, UnionType) else tuple([hint])

    @classmethod
    def parsed(cls, hint: object) -> "EventType":
        origin = get_origin(hint)
        if isinstance(origin, type):
            return cls(origin, get_args(hint)[0])
        if not isinstance(hint, type):
            raise TypeError(f"{hint} is no event")
        return cls(hint, cls.event_model(hint))

    @staticmethod
    def event_model(event_class: type) -> type[Model] | None:
        for owner in event_class.__mro__:
            for parent in owner.__dict__.get("__orig_bases__", ()):
                arguments = get_args(parent)
                if arguments and isinstance(arguments[0], type) and issubclass(arguments[0], Model):
                    return arguments[0]
        return None

    def pattern(self, moves: Sequence[Move]) -> str:
        if self.model is None:
            return self.event_class.name
        return self.event_class.pattern(self.model, moves)
