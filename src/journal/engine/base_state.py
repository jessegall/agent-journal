from dataclasses import dataclass, fields
from functools import cache
from inspect import getmembers, isfunction
from typing import Callable, ClassVar, get_type_hints

from journal.engine.nudge import Nudge
from journal.events.agent.compacting import Compacting
from journal.events.agent.session_ended import SessionEnded
from journal.events.event import Event
from journal.support.permission import Permission
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition

LISTENER = "on_"


@dataclass(frozen=True)
class BaseState:
    """The parent of every state. Its listeners are its on_ methods, bound to the event each hears by its annotation; its answers are unchanged, changed, push, pop and hold. It hears what every state hears: the context about to be compacted pushes Compacting, the session's end pushes Ended."""

    name: ClassVar[str]
    title: ClassVar[str] = ""
    allows: ClassVar[frozenset[Permission]] = frozenset()

    def on(self, event: Event, settings: Settings) -> Transition:
        answers = [listener(self, event, settings) for listener in self.listeners_for(type(event))]
        return Transition.merged(self, answers)

    @classmethod
    @cache
    def listeners(cls) -> tuple[tuple[type, Callable], ...]:
        found = [(get_type_hints(method)["event"], method) for name, method in getmembers(cls, isfunction) if cls.is_listener(name, method)]
        return tuple(sorted(found, key=lambda pair: (pair[1].__name__ not in cls.__dict__, -len(pair[0].__mro__))))

    @classmethod
    def is_listener(cls, name: str, method: Callable) -> bool:
        return name.startswith(LISTENER) and "event" in get_type_hints(method)

    @classmethod
    def listeners_for(cls, event: type) -> tuple[Callable, ...]:
        return tuple(method for heard, method in cls.listeners() if issubclass(event, heard))

    def unchanged(self, *nudges: Nudge) -> Transition:
        return Transition(self, nudges=nudges)

    def changed(self, now: "BaseState", *nudges: Nudge) -> Transition:
        return Transition(now, nudges=nudges)

    def push(self, to: "BaseState", *nudges: Nudge) -> Transition:
        return Transition(self, pushed=to, nudges=nudges)

    def pop(self, *nudges: Nudge) -> Transition:
        return Transition(self, popped=True, nudges=nudges)

    def hold(self, why: Nudge) -> Transition:
        return Transition(self, held=why)

    def on_compaction(self, event: Compacting, settings: Settings) -> Transition:
        from journal.engine.states.compacting import Compacting as CompactingState
        return self.push(CompactingState())

    def on_session_ended(self, event: SessionEnded, settings: Settings) -> Transition:
        from journal.engine.states.ended import Ended
        return self.push(Ended())

    def to_data(self) -> dict:
        return {field.name: getattr(self, field.name) for field in fields(self)}

    @classmethod
    def from_data(cls, data: dict) -> "BaseState":
        known = {field.name for field in fields(cls)}
        return cls(**{name: value for name, value in data.items() if name in known})
