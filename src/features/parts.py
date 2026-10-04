import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import TYPE_CHECKING, ClassVar

from controllers.types import Environments
from engine.events.resources import AgentChanged
from engine.reach import Reach
from engine.state import State
from engine.wording import digest
from features import trigger
from features.settings import Settings
from resources.base import SYSTEM

if TYPE_CHECKING:
    from features.journal import BoundJournal

ONCE_KEPT = 1000


class Speaker:
    def __init__(self, feature, record, row):
        self.feature, self.record, self.row = feature, record, row

    @property
    def session(self) -> str:
        return self.row.title

    def say(self, line: str, **values):
        return self.feature.journal.say(self.record, self.row, line, **values)

    def whisper(self, line: str, **values):
        return self.feature.journal.whisper(self.record, self.row, line, **values)

    def move_to_background(self) -> dict:
        from agents.control import move_to_background
        return move_to_background(self.record.root, self.record.env, self.session)


@dataclass
class Context:
    feature: object
    record: object
    agent: Speaker | None = None
    provider: object = None
    hook: object = None

    @classmethod
    def of(cls, feature, record, row=None, provider=None, hook=None) -> "Context":
        return cls(feature, record, Speaker(feature, record, row) if row else None, provider, hook)

    @property
    def journal(self) -> "BoundJournal":
        return self.feature.journal.at(self.record)

    @property
    def settings(self) -> "Settings":
        return self.feature.values(self.record) if self.record else Settings(self.feature.settings, {})

    def on(self, behaviour: str = "") -> bool:
        return self.feature.on(self.record, behaviour)

    def speaking_to(self, row) -> "AgentContext":
        return AgentContext.of(self.feature, self.record, row, self.provider, self.hook)

    def to_primary(self) -> "AgentContext | None":
        agent = self.journal.agents.primary()
        return self.speaking_to(agent) if agent else None

    def due(self, behaviour: str = "") -> bool:
        return bool(self.agent) and self.feature.due(self.record, self.agent.row, behaviour)

    def hold(self, line: str, behaviour: str = "", **values) -> None:
        self.feature.hold(self.record, line, behaviour, self.agent.row if self.agent else None, **values)

    def release(self, behaviour: str = "") -> None:
        self.feature.release(self.record, behaviour, self.agent.row if self.agent else None)

    def every(self, kind: str, key: str, cadence: trigger.Trigger) -> bool:
        return trigger.claimed(self.record, self.agent.row, f"{self.feature.name}.{kind}.{digest(key.strip(), 12)}", cadence)

    def at_most(self, kind: str, key: str, times: int) -> bool:
        if self.used_up(kind, key, times):
            return False
        store, name = self._count(kind, key)
        store.set(name, int(store.get(name, 0)) + 1)
        return True

    def used_up(self, kind: str, key: str, times: int) -> bool:
        store, name = self._count(kind, key)
        return int(store.get(name, 0)) >= times

    def _count(self, kind: str, key: str) -> tuple:
        return self.record.state("counts", self.agent.session), f"{kind}.{digest(key.strip())}"

    def once(self, kind: str, key: str, then=None) -> bool:
        store, name = self.record.state("once", self.agent.session), f"{kind}.{digest(key.strip())}"
        if then and (store.get(name) is not None or not then()):
            return False
        return store.claim(name, time.time(), keep=ONCE_KEPT)

    @property
    def state(self) -> "State":
        return self.record.state(self.feature.name, self.agent.session if self.agent else None)


@dataclass
class AgentContext(Context):
    agent: Speaker = field()

    @classmethod
    def of(cls, feature, record, row, provider=None, hook=None) -> "AgentContext":
        return cls(feature, record, Speaker(feature, record, row), provider, hook)

    @property
    def working_folder(self) -> Path:
        cwd = Path(self.agent.row.cwd) if self.agent.row.cwd else None
        return cwd if cwd and cwd.is_dir() else self.record.root.parent


WHOLE_FEATURE = ""


class Handler:
    behaviour: ClassVar[str | None] = None

    def handle(self, context: Context, event) -> None:
        raise NotImplementedError


class OnAgentUpdated:
    def handle(self, context: AgentContext, event: AgentChanged) -> None:
        if event.action == "updated":
            super().handle(context, event)


class TextFormatter:
    surfaces: ClassVar[tuple] = ()
    behaviour: ClassVar[str | None] = None

    def format(self, context: Context, text: str) -> str:
        raise NotImplementedError


class ToolInterceptor:
    reach: ClassVar[Reach]
    behaviour: ClassVar[str | None] = None
    refuses: ClassVar[bool] = True
    limit: ClassVar[str] = ""
    steps_aside: ClassVar[str] = ""
    before_checks: ClassVar[bool] = False

    def intercept(self, context: "AgentContext", call) -> str:
        raise NotImplementedError


class Canceler:
    reach: ClassVar[Reach]
    event: ClassVar[str] = ""

    def cancel(self, context: "AgentContext", data) -> str:
        raise NotImplementedError


class Command:
    name: ClassVar[str] = ""
    network: ClassVar[bool] = False

    def run(self, context: Context, controller, *args, **kwargs):
        raise NotImplementedError


class ActionInterceptor:
    def intercept(self, context: Context, controller, **args):
        raise NotImplementedError


def in_background(record) -> bool:
    row = Environments(record, actor=SYSTEM)._titled(record.env)
    return bool(row and row.owner)
