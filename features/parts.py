import hashlib
import inspect
import time
from dataclasses import dataclass, field
from typing import TYPE_CHECKING, ClassVar, get_type_hints

from controllers.base import COMMANDS, HANDLERS
from controllers.types import Agents
from engine import bus
from engine.events import AgentEvent
from engine.hooks import POLICIES
from engine.state import State
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

    def command(self, line: str) -> dict:
        from surfaces.control import request
        action, _, value = line.partition(" ")
        return request(self.record.root, self.record.env, self.session, action, value.strip())


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

    def due(self, behaviour: str = "") -> bool:
        return bool(self.agent) and self.feature.due(self.record, self.agent.row, behaviour)

    def hold(self, line: str, behaviour: str = "", **values) -> None:
        self.feature.hold(self.record, line, behaviour, self.agent.row if self.agent else None, **values)

    def release(self, behaviour: str = "") -> None:
        self.feature.release(self.record, behaviour, self.agent.row if self.agent else None)

    def once(self, kind: str, key: str) -> bool:
        return self.record.state("once", self.agent.session).claim(f"{kind}.{hashlib.sha1(key.strip().encode()).hexdigest()}", time.time())

    @property
    def state(self) -> "State":
        return self.record.state(self.feature.name, self.agent.session if self.agent else "")


@dataclass
class AgentContext(Context):
    agent: Speaker = field()

    @classmethod
    def of(cls, feature, record, row, provider=None, hook=None) -> "AgentContext":
        return cls(feature, record, Speaker(feature, record, row), provider, hook)


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
    limit: ClassVar[str] = ""

    def intercept(self, context: "AgentContext", call) -> str:
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
            if not typed.wanted():
                return
            if isinstance(typed, AgentEvent) and not typed.agent:
                return
            row = Agents(record, actor=SYSTEM).load(typed.agent) if isinstance(typed, AgentEvent) else None
            if wanted(handler, feature, record, row):
                handler.handle(AgentContext.of(feature, record, row) if row else Context.of(feature, record), typed)
        self.names.append(kind.event_name or kind.on)
        bus.on(kind.on, run, enabled=feature.enabled)


class Client:
    def __init__(self, feature):
        self.feature = feature

    def formatter(self, formatter: TextFormatter) -> None:
        feature = self.feature
        FORMATTERS.append((lambda text, record: formatter.format(Context.of(feature, record), text)
                           if not record or (feature.enabled(record) and wanted(formatter, feature, record, None, timed=False)) else text,
                           formatter.surfaces))


def limited(context: "AgentContext", interceptor: ToolInterceptor, refused: str) -> str:
    key = f"refused.{type(interceptor).__name__}"
    count = int(context.state.get(key, 0)) + 1 if refused else 0
    context.state.set(key, count)
    return refused if count <= int(context.settings[interceptor.limit]) else ""


class AgentHooks:
    def __init__(self, feature):
        self.feature = feature

    def interceptor(self, interceptor: ToolInterceptor) -> None:
        feature = self.feature

        def policy(provider, record, hook, session) -> str:
            if hook.tool.loads_skill:
                return ""
            row = Agents(record, actor=SYSTEM).by_session(session)
            if not feature.enabled(record) or not wanted(interceptor, feature, record, row, timed=False):
                return ""
            context = AgentContext.of(feature, record, row, provider, hook)
            refused = interceptor.intercept(context, hook.tool) or ""
            return limited(context, interceptor, refused) if interceptor.limit else refused
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
