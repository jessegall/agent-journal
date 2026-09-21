from dataclasses import dataclass
from typing import TYPE_CHECKING, get_type_hints

from controllers.types import Agents
from engine import bus
from engine.events import AgentEvent
from engine.hooks import POLICIES
from features.format import FORMATTERS
from resources.base import SYSTEM

if TYPE_CHECKING:
    from features.journal import BoundJournal

from features.settings import Settings


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

    def type(self, line: str, **values):
        return self.feature.journal.type(self.record, self.row, line, **values)


@dataclass
class Context:
    feature: object
    record: object
    agent: Speaker | None = None

    @classmethod
    def of(cls, feature, record, row=None) -> "Context":
        return cls(feature, record, Speaker(feature, record, row) if row else None)

    @property
    def journal(self) -> "BoundJournal":
        return self.feature.journal.at(self.record)

    @property
    def settings(self) -> "Settings":
        return self.feature.values(self.record) if self.record else Settings(self.feature.settings, {})

    def on(self, behaviour: str = "") -> bool:
        return self.feature.on(self.record, behaviour)

    def once(self, kind: str, key: str) -> bool:
        return not self.feature.already(self.record, self.agent.session, kind, key)


class Handler:
    def handle(self, context: Context, event) -> None:
        raise NotImplementedError


class TextFormatter:
    surfaces: tuple = ()

    def format(self, context: Context, text: str) -> str:
        raise NotImplementedError


class ToolInterceptor:
    def intercept(self, context: Context, call) -> str:
        raise NotImplementedError


class Events:
    def __init__(self, feature):
        self.feature = feature
        self.names: list[str] = []

    def handler(self, handler: Handler) -> None:
        kind, feature = get_type_hints(handler.handle)["event"], self.feature

        def run(event, record) -> None:
            typed = kind.read(event)
            row = Agents(record, actor=SYSTEM).load(typed.agent) if isinstance(typed, AgentEvent) and typed.agent else None
            handler.handle(Context.of(feature, record, row), typed)
        self.names.append(kind.on)
        bus.on(kind.on, run, enabled=feature.enabled)


class Client:
    def __init__(self, feature):
        self.feature = feature

    def formatter(self, formatter: TextFormatter) -> None:
        feature = self.feature
        FORMATTERS.append((lambda text, record: formatter.format(Context.of(feature, record), text) if not record or feature.enabled(record) else text,
                           formatter.surfaces))


class AgentHooks:
    def __init__(self, feature):
        self.feature = feature

    def interceptor(self, interceptor: ToolInterceptor) -> None:
        feature = self.feature

        def policy(provider, record, hook, session) -> str:
            if not feature.enabled(record):
                return ""
            return interceptor.intercept(Context.of(feature, record, Agents(record, actor=SYSTEM).by_session(session)), hook.tool) or ""
        policy.feature = feature
        POLICIES.append(policy)
