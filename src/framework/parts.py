import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import TYPE_CHECKING, ClassVar

from controllers.base import Arguments
from controllers.agents import Agents
from controllers.environments import Environments
from controllers.messages import Messages
from engine.state import State
from framework.marks import mark_of
from framework.displayed import send_row_to_chat
from resources.allowances import Allowance
from resources.text import digest
from payload import STATUS, HookEvent
from declaring import trigger
from engine import triggering
from declaring.settings import Settings
from resources.base import AGENT, SYSTEM, USER, titled

if TYPE_CHECKING:
    from framework.journal import BoundJournal

ONCE_KEPT = 1000
ANY_BUT_PRE_TOOL_USE = tuple(hook for hook in STATUS if hook != HookEvent.PRE_TOOL_USE)
ANY_BUT_POST_TOOL_USE = tuple(hook for hook in STATUS if hook != HookEvent.POST_TOOL_USE)


class Speaker:
    def __init__(self, feature, record, row):
        self.feature, self.record, self.row = feature, record, row

    @property
    def session(self) -> str:
        return self.row.title

    def say(self, line: str, **values):
        return self.feature.journal.say(self.record, self.row, line, **values)

    def nudge(self, line: str, **values):
        return self.feature.journal.whisper(self.record, self.row, line, **values)

    def send(self, text: str, turn: str | None = None) -> bool:
        """The words of a turn the agent wrote go to the chat, once: the ledger of what was shown knows a turn it has seen, and a blank turn is none."""
        return bool(text.strip()) and send_row_to_chat(self.record, self.row, text, turn)

    def notice(self, line: str, **values):
        """A line the user reads in the notices, about this agent's environment."""
        return self.feature.journal.notice(self.record, line, **values)

    def remind(self, line: str, **values):
        return self.feature.journal.remind(self.record, self.row, line, **values)

    def hold(self, line: str, behaviour: str = "", **values) -> None:
        self.feature.hold(self.record, line, behaviour, self.row, **values)

    def release(self, behaviour: str = "") -> None:
        self.feature.release(self.record, behaviour, self.row)

    def post(self, text: str, turn: str, **data) -> None:
        """The agent's own words reach the chat as its message, once: words already there from it are not posted again."""
        messages = Messages(self.record, actor=AGENT)
        if not messages.already_posted(text):
            messages.create(titled(text), brief=text, idempotency=turn, **data)

    def post_as_user(self, title: str, brief: str, **data) -> None:
        """A message in the chat in the user's own name, which a trigger the user wrote sends for them."""
        Messages(self.record, actor=USER).create(title, brief=brief, **data)




class Marks:
    """What the journal keeps of when a feature last did something for an agent, and the counts and once-claims that pace it."""

    def __init__(self, feature, record, row):
        self.feature, self.record, self.row = feature, record, row

    def last(self, name: str) -> "triggering.Mark":
        return mark_of(self.record, self.row.title, name)

    def write(self, name: str, **fields) -> None:
        triggering.write(self.record, self.row, name, **fields)

    def noticed(self, name: str) -> None:
        triggering.noticed(self.record, self.row, name)

    def every(self, kind: str, key: str, cadence: trigger.Trigger) -> bool:
        return triggering.claimed(self.record, self.row, f"{self.feature.name}.{kind}.{digest(key.strip(), 12)}", cadence)

    def at_most(self, allowed: Allowance) -> bool:
        if self.used_up(allowed):
            return False
        store, name = self._count(allowed.kind, allowed.key)
        store.set(name, int(store.get(name, 0)) + 1)
        return True

    def used_up(self, allowed: Allowance) -> bool:
        store, name = self._count(allowed.kind, allowed.key)
        return int(store.get(name, 0)) >= allowed.times

    def _count(self, kind: str, key: str) -> tuple:
        return self.record.state("counts", self.row.title), f"{kind}.{digest(key.strip())}"

    def once(self, kind: str, key: str, then=None) -> bool:
        store, name = self.record.state("once", self.row.title), f"{kind}.{digest(key.strip())}"
        if then and (store.get(name) is not None or not then()):
            return False
        return store.claim(name, time.time(), keep=ONCE_KEPT)


@dataclass
class Context:
    feature: object
    record: object
    agent: Speaker | None = None
    provider: object = None
    hook: object = None
    fakes: dict = field(default_factory=dict)
    """The services a play answers for itself, by type, where a command would ask the journal's own."""

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

    def service(self, kind: type):
        """A service of the journal, as a receiver of this feature is handed it."""
        from framework.lanes import served
        return self.fakes[kind] if kind in self.fakes else served(self.record, kind, self.feature.name)

    def speaking_to(self, row) -> "AgentContext":
        return AgentContext.of(self.feature, self.record, row, self.provider, self.hook)

    def to_primary(self) -> "AgentContext | None":
        agent = self.journal.get(Agents).primary_to_read()
        return self.speaking_to(agent) if agent else None

    def due(self, behaviour: str = "") -> bool:
        return bool(self.agent) and self.feature.due(self.record, self.agent.row, behaviour)

    def hold(self, line: str, behaviour: str = "", **values) -> None:
        self.feature.hold(self.record, line, behaviour, self.agent.row if self.agent else None, **values)

    def release(self, behaviour: str = "") -> None:
        self.feature.release(self.record, behaviour, self.agent.row if self.agent else None)

    def every(self, kind: str, key: str, cadence: trigger.Trigger) -> bool:
        return self.marks().every(kind, key, cadence)

    def at_most(self, allowed: Allowance) -> bool:
        return self.marks().at_most(allowed)

    def used_up(self, allowed: Allowance) -> bool:
        return self.marks().used_up(allowed)

    def once(self, kind: str, key: str, then=None) -> bool:
        return self.marks().once(kind, key, then)

    def marks(self) -> "Marks":
        return Marks(self.feature, self.record, self.agent.row)

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


class Command:
    name: ClassVar[str] = ""
    network: ClassVar[bool] = False
    user_only: ClassVar[bool] = False

    def run(self, context: Context, controller, *args, **kwargs):
        raise NotImplementedError

    def runs_commands(self, controller, arguments: Arguments) -> bool:
        return False


class ActionInterceptor:
    """Runs before a controller action; it refuses by raising, and answers nothing."""

    def intercept(self, feature_context: Context, controller, **args) -> None:
        raise NotImplementedError


def in_background(record) -> bool:
    row = Environments(record, actor=SYSTEM).rows.by_title(record.env)
    return bool(row and row.owner)
