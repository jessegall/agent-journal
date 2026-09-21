import inspect
from dataclasses import dataclass
from typing import TYPE_CHECKING, ClassVar, get_type_hints

from controllers.base import COMMANDS, HANDLERS
from controllers.types import Agents
from engine import bus
from engine.events import AgentEvent
from engine.hooks import POLICIES
from features.format import FORMATTERS
from resources.base import SYSTEM, Refused

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

    def speaking_to(self, row) -> "Context":
        return Context.of(self.feature, self.record, row, self.provider, self.hook)

    def due(self, behaviour: str = "") -> bool:
        return bool(self.agent) and self.feature.due(self.record, self.agent.row, behaviour)

    def hold(self, line: str, behaviour: str = "", **values) -> None:
        self.feature.hold(self.record, line, behaviour, self.agent.row if self.agent else None, **values)

    def release(self, behaviour: str = "") -> None:
        self.feature.release(self.record, behaviour, self.agent.row if self.agent else None)

    def once(self, kind: str, key: str) -> bool:
        return not self.feature.already(self.record, self.agent.session, kind, key)


WHOLE_FEATURE = ""


def wanted(part, feature, record, row, timed: bool = True) -> bool:
    if part.behaviour is None:
        return True
    if not timed or not feature.cadence(record, part.behaviour):
        return feature.on(record, part.behaviour)
    return bool(row) and feature.due(record, row, part.behaviour)


class Handler:
    behaviour: ClassVar[str | None] = None

    def handle(self, context: Context, event) -> None:
        raise NotImplementedError


class TextFormatter:
    surfaces: ClassVar[tuple] = ()
    behaviour: ClassVar[str | None] = None

    def format(self, context: Context, text: str) -> str:
        raise NotImplementedError


class ToolInterceptor:
    behaviour: ClassVar[str | None] = None

    def intercept(self, context: Context, call) -> str:
        raise NotImplementedError


class Command:
    name: ClassVar[str] = ""

    def run(self, context: Context, controller, *args, **kwargs):
        raise NotImplementedError


class ActionInterceptor:
    def intercept(self, context: Context, controller, **args):
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
            if wanted(handler, feature, record, row):
                handler.handle(Context.of(feature, record, row), typed)
        self.names.append(kind.on)
        bus.on(kind.on, run, enabled=feature.enabled)


class Client:
    def __init__(self, feature):
        self.feature = feature

    def formatter(self, formatter: TextFormatter) -> None:
        feature = self.feature
        FORMATTERS.append((lambda text, record: formatter.format(Context.of(feature, record), text)
                           if not record or (feature.enabled(record) and wanted(formatter, feature, record, None, timed=False)) else text,
                           formatter.surfaces))


class AgentHooks:
    def __init__(self, feature):
        self.feature = feature

    def interceptor(self, interceptor: ToolInterceptor) -> None:
        feature = self.feature

        def policy(provider, record, hook, session) -> str:
            row = Agents(record, actor=SYSTEM).by_session(session)
            if not feature.enabled(record) or not wanted(interceptor, feature, record, row, timed=False):
                return ""
            return interceptor.intercept(Context.of(feature, record, row, provider, hook), hook.tool) or ""
        policy.feature = feature
        POLICIES.append(policy)


class Commands:
    def __init__(self, feature):
        self.feature = feature

    def add(self, type_: str, command: Command) -> None:
        feature = self.feature

        def call(controller, *args, **kwargs):
            if not feature.enabled(controller.record):
                raise Refused(f"the {feature.name} feature is off")
            return command.run(Context.of(feature, controller.record), controller, *args, **kwargs)
        given = list(inspect.signature(command.run).parameters.values())[2:]
        call.__signature__ = inspect.Signature([inspect.Parameter("controller", inspect.Parameter.POSITIONAL_OR_KEYWORD), *given])
        call.__name__ = command.name
        COMMANDS.setdefault(type_, {})[command.name] = call

    def intercept(self, action: str, interceptor: ActionInterceptor) -> None:
        feature = self.feature
        HANDLERS.setdefault(action, []).append(
            lambda controller, **args: interceptor.intercept(Context.of(feature, controller.record), controller, **args) if feature.enabled(controller.record) else None)
