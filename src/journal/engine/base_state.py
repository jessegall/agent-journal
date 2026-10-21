from dataclasses import dataclass, fields
from functools import cache
from inspect import getmembers, isfunction
from typing import Callable, ClassVar, get_type_hints

from journal.engine.conduct import Conduct
from journal.engine.nudge import Nudge
from journal.engine.support.held import Held
from journal.engine.support.typist import Typist
from journal.events.readings import Readings
from journal.events.agent.compacting import Compacting
from journal.events.agent.session_ended import SessionEnded
from journal.events.event import Event
from journal.support.permission import Permission
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition

LISTENER = "on_"


@dataclass(frozen=True)
class BaseState(Conduct):
    """The parent of every state. Its listeners are its on_ methods, bound to the event each hears by its annotation; its answers are unchanged, changed, push, pop, pop_through, which pops and hands the event to the state beneath, and hold, and a listener that stops the event's propagation is the last to hear it. A state entering or leaving the stack is handed the typist and may switch it off or on. It hears what every state hears: the context about to be compacted pushes Compacting, the session's end pushes Ended."""

    title: ClassVar[str] = ""
    allows: ClassVar[frozenset[Permission]] = frozenset()
    conducts: ClassVar[tuple[type[Conduct], ...]] = ()

    def on(self, event: Event, settings: Settings) -> Transition:
        answers: list[Transition] = []
        event.propagation.reset()
        for listener in self.listeners_for(type(event)):
            answers.append(listener(self, event, settings))
            if not event.propagation.ongoing:
                break
        return Transition.merged(self, answers)

    @classmethod
    def fold(cls, conducts: tuple[type[Conduct], ...]) -> None:
        BaseState.conducts = conducts
        BaseState.listeners.__func__.cache_clear()
        BaseState.listeners_for.__func__.cache_clear()

    @classmethod
    @cache
    def listeners(cls) -> tuple[tuple[type, Callable], ...]:
        own = [(get_type_hints(method)["event"], method, method.__name__ not in cls.__dict__) for name, method in getmembers(cls, isfunction) if cls.is_listener(name, method)]
        folded = [(get_type_hints(method)["event"], method, 2) for conduct in BaseState.conducts for name, method in getmembers(conduct, isfunction) if cls.is_listener(name, method) and not hasattr(cls, name)]
        ranked = sorted([*own, *folded], key=lambda entry: (int(entry[2]), -len(entry[0].__mro__)))
        return tuple((event_kind, method) for event_kind, method, rank in ranked)

    @classmethod
    def is_listener(cls, name: str, method: Callable) -> bool:
        return name.startswith(LISTENER) and "event" in get_type_hints(method)

    @classmethod
    @cache
    def listeners_for(cls, event: type) -> tuple[Callable, ...]:
        return tuple(method for event_kind, method in cls.listeners() if issubclass(event, event_kind))

    def on_compaction(self, event: Compacting, settings: Settings) -> Transition:
        from journal.engine.states.compacting import Compacting as CompactingState
        return self.push(CompactingState())

    def on_session_ended(self, event: SessionEnded, settings: Settings) -> Transition:
        from journal.engine.states.ended import Ended
        return self.push(Ended())

    def on_push(self, settings: Settings) -> tuple[Nudge, ...] | Held:
        return ()

    def on_suspend(self, settings: Settings) -> tuple[Nudge, ...]:
        return ()

    def on_resume(self, readings: Readings, settings: Settings) -> tuple[Nudge, ...] | Transition:
        return ()

    def on_pop(self, settings: Settings) -> tuple[Nudge, ...]:
        return ()

    def is_waiting(self) -> bool:
        return False

    def refuses_every_tool(self) -> bool:
        return False

    def on_enter(self, typist: Typist) -> None:
        return None

    def on_exit(self, typist: Typist) -> None:
        return None

    def to_data(self) -> dict:
        return {field.name: getattr(self, field.name) for field in fields(self)}

    def printed(self) -> str:
        set_fields = [f"{field.name}={getattr(self, field.name)}" for field in fields(self) if getattr(self, field.name) != field.default and not isinstance(getattr(self, field.name), float)]
        return f"{self.name}({', '.join(set_fields)})" if set_fields else self.name

    @classmethod
    def from_data(cls, data: dict) -> "BaseState":
        known = {field.name for field in fields(cls)}
        return cls(**{name: value for name, value in data.items() if name in known})
