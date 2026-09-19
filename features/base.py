import json
from abc import ABC
from typing import ClassVar

from controllers.types import Agents, CONTROLLERS, Nudges
from engine import bus
from features import trigger
from providers.base import gate_file
from resources.base import SYSTEM

REGISTRY: dict[str, type] = {}


def on(pattern: str):
    def mark(fn):
        fn.patterns = (*getattr(fn, "patterns", ()), pattern)
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

    def register(self) -> None:
        for pattern, handler in self.listeners():
            bus.on(pattern, handler, enabled=self.enabled)

    def enabled(self, record) -> bool:
        return True if self.fixed else record.features.get(self.name, self.default)

    def enable(self, record) -> None:
        record.features = {**record.features, self.name: True}

    def disable(self, record) -> None:
        record.features = {**record.features, self.name: False}

    def agent(self, event, record):
        return Agents(record, actor=SYSTEM).load(event.n)

    def agent_due(self, event, record):
        agent = self.agent(event, record)
        return agent if self.due(record, agent) else None

    def standing(self, record, type_: str) -> list:
        return [r for r in CONTROLLERS[type_](record, actor=SYSTEM).all() if not r.completed]

    def due(self, record, agent) -> bool:
        if not self.trigger or not trigger.due(record, agent, self.name, self.trigger):
            return False
        trigger.fired(record, agent, self.name)
        return True

    def hold(self, record, why: str) -> None:
        for agent in Agents(record, actor=SYSTEM).all():
            f = gate_file(record.root, record.env, agent.title)
            f.parent.mkdir(parents=True, exist_ok=True)
            try:
                holds = json.loads(f.read_text())
            except (OSError, ValueError):
                holds = {}
            holds[self.name] = why
            f.write_text(json.dumps(holds))

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
    type = ""
    said = "standing, read them"

    @on("agent.updated")
    def repeat(self, event, record) -> None:
        agent = self.agent_due(event, record)
        rows = self.standing(record, self.type) if agent else []
        if rows:
            self.nudge(record, agent, f"{self.plural(len(rows), self.type)} {self.said}", "; ".join(f"{r.n}. {r.title}" for r in rows))
