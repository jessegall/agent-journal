import json
from abc import ABC
from functools import wraps
from typing import ClassVar

from controllers.base import COMMANDS
from controllers.types import Agents, Nudges
from engine import bus
from features import trigger
from engine.hooks import POLICIES, gate_file
from features.format import FORMATTERS
from resources.base import Refused, SYSTEM, WHOM
from engine.stored import read_json, write_json

REGISTRY: dict[str, type] = {}


def held(record, session: str) -> str:
    try:
        holds = json.loads(gate_file(record.root, record.env, session).read_text())
    except (OSError, ValueError):
        return ""
    return "; ".join(why for why in holds.values() if why)


def event(pattern: str):
    def mark(fn):
        fn.patterns = (*getattr(fn, "patterns", ()), pattern)
        return fn
    return mark


def chatformatter(fn):
    fn.chatformats = True
    return fn


def interceptor(fn):
    fn.intercepts = True
    return fn


def command(type_: str):
    def mark(fn):
        fn.command = type_
        return fn
    return mark


class Feature(ABC):
    name: ClassVar[str] = ""
    title_: ClassVar[str] = ""
    abstract_: ClassVar[str] = ""
    help_: ClassVar[str] = ""
    trigger: ClassVar[dict] = {}
    default: ClassVar[bool] = True
    fixed: ClassVar[bool] = False

    def __init_subclass__(cls, **kw):
        super().__init_subclass__(**kw)
        if cls.name:
            REGISTRY[cls.name] = cls

    def listeners(self) -> list[tuple[str, object]]:
        return [(pattern, getattr(self, attr)) for attr in dir(type(self))
                for fn in [getattr(type(self), attr)] if callable(fn) for pattern in getattr(fn, "patterns", ())]

    def refusals(self) -> list:
        return [getattr(self, attr) for attr in dir(type(self)) for fn in [getattr(type(self), attr)] if callable(fn) and getattr(fn, "intercepts", False)]

    def formatters(self) -> list:
        return [getattr(self, attr) for attr in dir(type(self)) for fn in [getattr(type(self), attr)] if callable(fn) and getattr(fn, "chatformats", False)]

    def commands(self) -> list:
        return [getattr(self, attr) for attr in dir(type(self)) for fn in [getattr(type(self), attr)] if callable(fn) and getattr(fn, "command", "")]

    def guarded(self, fn):
        @wraps(fn)
        def run(controller, *args, **kwargs):
            if not self.enabled(controller.record):
                raise Refused(f"the {self.name} feature is off")
            return fn(controller, *args, **kwargs)
        return run

    def register(self) -> None:
        for fn in self.commands():
            COMMANDS.setdefault(fn.command, {})[fn.__name__] = self.guarded(fn)
        for pattern, handler in self.listeners():
            bus.on(pattern, handler, enabled=self.enabled)
        for handler in self.refusals():
            POLICIES.append(lambda provider, record, payload, session, handler=handler: handler(provider, record, payload, session) if self.enabled(record) else "")
        for shaper in self.formatters():
            FORMATTERS.append(lambda text, record, shaper=shaper: shaper(text, record) if not record or self.enabled(record) else text)

    @classmethod
    def on_for(cls, record) -> bool:
        return True if cls.fixed else record.features.get(cls.name, cls.default)

    def enabled(self, record) -> bool:
        return self.on_for(record)

    def enable(self, record) -> None:
        record.features = {**record.features, self.name: True}

    def disable(self, record) -> None:
        record.features = {**record.features, self.name: False}

    def agent(self, event, record):
        return Agents(record, actor=SYSTEM).load(event.n)

    def agent_due(self, event, record):
        agent = self.agent(event, record)
        return agent if self.due(record, agent) else None

    def standing(self, record, controller: type) -> list:
        return [r for r in controller(record, actor=SYSTEM).all() if not r.completed]

    def due(self, record, agent) -> bool:
        if not self.trigger or not trigger.due(record, agent, self.name, self.trigger):
            return False
        trigger.fired(record, agent, self.name)
        return True

    def hold(self, record, why: str) -> None:
        for agent in Agents(record, actor=SYSTEM).all():
            f = gate_file(record.root, record.env, agent.title)
            write_json(f, {**read_json(f, {}), self.name: why})

    def release(self, record) -> None:
        self.hold(record, "")

    def nudge(self, record, agent, title: str, brief: str = "", private: bool = False) -> None:
        Nudges(record, actor=SYSTEM).create(title, brief=brief, session=agent.title, private=private)

    def plural(self, n: int, word: str) -> str:
        return f"{n} {word}{'s' if n != 1 else ''}"

    def describe(self) -> dict:
        return {"name": self.name, "title": self.title_, "abstract": self.abstract_, "help": self.help_, "default": self.default, "fixed": self.fixed,
                "listens": sorted({p for p, _ in self.listeners()}), "trigger": dict(self.trigger)}


class Recital(Feature):
    controller: ClassVar[type]
    said = "standing, read them"

    @event("agent.updated")
    def repeat(self, event, record) -> None:
        agent = self.agent_due(event, record)
        rows = [r for r in self.standing(record, self.controller) if r.data.get(WHOM, agent.title) == agent.title] if agent else []
        if rows:
            self.nudge(record, agent, f"{self.plural(len(rows), self.controller.resource.type)} {self.said}", "; ".join(f"{r.n}. {r.title}" for r in rows))
