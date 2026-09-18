import json
from abc import ABC
from typing import ClassVar

from v2.controllers.types import CONTROLLERS
from v2.engine import bus
from v2.features import trigger
from v2.providers.base import gate_file
from v2.resources.base import SYSTEM

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
        return record.setting("features", {}).get(self.name, self.default)

    def enable(self, record) -> None:
        record.set_setting("features", {**record.setting("features", {}), self.name: True})

    def disable(self, record) -> None:
        record.set_setting("features", {**record.setting("features", {}), self.name: False})

    def due(self, record, agent) -> bool:
        if not self.trigger or not trigger.due(record, agent, self.name, self.trigger):
            return False
        trigger.fired(record, agent, self.name)
        return True

    def hold(self, record, why: str) -> None:
        for agent in CONTROLLERS["agent"](record, actor=SYSTEM).all():
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

    def nudge(self, record, agent, title: str, brief: str = "") -> None:
        CONTROLLERS["nudge"](record, actor=SYSTEM).create(title, brief=brief, session=agent.title)

    def describe(self) -> dict:
        return {"name": self.name, "title": self.title_, "abstract": self.abstract_, "help": self.help_, "default": self.default,
                "listens": sorted({p for p, _ in self.listeners()}), "trigger": dict(self.trigger)}
