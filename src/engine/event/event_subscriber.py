from collections.abc import Sequence
from functools import cache
from typing import ClassVar, Generic, TypeVar

from engine.container.single_instance import SingleInstance
from engine.event.event_pattern import EventPattern
from engine.event.event_type import EventType
from engine.model.move import Move

E = TypeVar("E", contravariant=True, default=object)


class EventSubscriber(SingleInstance, Generic[E]):
    """What listeners and guards share: the events a class hears, read once from its type parameter when the class
    is made, and the pattern the registry keeps for them."""

    event: ClassVar[str]
    moves: ClassVar[Sequence[Move]] = ()
    event_types: ClassVar[tuple[EventType, ...]] = ()

    def __init_subclass__(cls, **options: object) -> None:
        super().__init_subclass__(**options)
        declared = EventType.declared(cls, EventSubscriber)
        if declared:
            cls.event_types = declared
            cls.event = "|".join(event_type.pattern(cls.moves) for event_type in declared)

    @classmethod
    @cache
    def event_type(cls, event_name: str) -> EventType:
        return next(event_type for event_type in cls.event_types if EventPattern(event_type.pattern(cls.moves)).matches(event_name))
