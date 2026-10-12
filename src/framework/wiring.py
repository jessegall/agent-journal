import inspect
import time
from typing import get_type_hints

from controllers.base import COMMANDS, HANDLERS
from controllers.types import Agents
from engine import bus
from engine.developing import developing
from events.typed import AgentEvent
from engine.gates import CANCELERS, RESPONDERS, HookCall, policies
from declaring.reach import Guard
from engine.wording import APPENDS
from framework.format import FORMATTERS, FORMATTING_FEATURES
from framework.parts import ActionInterceptor, AgentContext, Canceler, Command, Context, Handler, TextFormatter, ToolInterceptor
from resources.base import SYSTEM, USER, Refused
from framework.routing import FEATURE_ROUTES
from receiving import ANSWER, HANDLE, LISTEN, REFUSE, REGISTERED, Answerer, Handler, Listener, Refuser, Registration
from framework.adapter import adapted_beside_the_bus
from framework.promises import PROMISED, Promise
from expects.watching import WATCH


def wanted(part, feature, record, row, timed: bool = True) -> bool:
    if part.behaviour is None:
        return True
    if not timed or not feature.cadence(record, part.behaviour):
        return feature.on(record, part.behaviour)
    return bool(row) and feature.due(record, row, part.behaviour)


def agent_row(record, n: int):
    """The agent's row for a handler to read: the one the store holds, not a copy, since a handler that changes the agent does it through the controller."""
    if record.memo is None:
        return Agents(record, actor=SYSTEM).peek(n)
    key = ("agent row", n)
    if key not in record.memo:
        record.memo[key] = Agents(record, actor=SYSTEM).peek(n)
    return record.memo[key]


def watched(promise, event, record, began: float) -> None:
    """Where the journal develops itself, a handler's run is noted for the watch, which looks at it elsewhere and on its own time; a run with no record is not watched."""
    if record is not None and developing(record.root.parent):
        WATCH.ran(promise, event, record, began)


class Events:
    def __init__(self, feature):
        self.feature = feature
        self.names: list[str] = []

    def handler(self, handler: Handler, expects=()) -> None:
        if self.feature.commands_only:
            return
        kind, feature = get_type_hints(handler.handle)["event"], self.feature
        promise = Promise(feature, "handler", type(handler).__name__, handler, kind, tuple(expects))
        PROMISED.add(promise)

        def run(event, record) -> None:
            typed = kind.read(event)
            if not typed.wanted():
                return
            if isinstance(typed, AgentEvent) and not typed.agent:
                return
            row = agent_row(record, typed.agent) if isinstance(typed, AgentEvent) else None
            if wanted(handler, feature, record, row):
                began = time.time()
                handler.handle(AgentContext.of(feature, record, row) if row else Context.of(feature, record), typed)
                watched(promise, typed, record, began)
        self.names.append(kind.name())
        for pattern in kind.patterns(handler.hooks):
            bus.on(pattern, run, enabled=feature.enabled)
        adapted_beside_the_bus(feature, handler, run, kind)

    def listen(self, event: type, listener: Listener, expects) -> None:
        """Reads the event and dispatches the facts it recognises; read-only, in the tick the event belongs to."""
        self.register(LISTEN, event, listener, expects)

    def handle(self, fact: type, handler: Handler, expects, after: tuple[str, ...] = ()) -> None:
        """Acts on the fact in the next tick, inside that tick's transaction; after names the handlers on this fact it must follow, by name, since importing another feature is forbidden."""
        self.register(HANDLE, fact, handler, expects, after)

    def answer(self, request: type, answerer: Answerer, expects) -> None:
        """Answers the request synchronously and read-only, before anything about it writes."""
        self.register(ANSWER, request, answerer, expects)

    def register(self, kind: str, event: type, receiver, expects, after: tuple[str, ...] = ()) -> None:
        """Holds one registration until the wiring is read; a feature loaded for its commands alone registers none."""
        if self.feature.commands_only:
            return
        REGISTERED.add(Registration.read(kind, event, receiver, expects, self.feature.name, after))


class Client:
    def __init__(self, feature):
        self.feature = feature

    def formatter(self, formatter: TextFormatter, expects=()) -> None:
        PROMISED.add(Promise(self.feature, "formatter", type(formatter).__name__, formatter, str, tuple(expects)))
        feature = self.feature
        if feature not in FORMATTING_FEATURES:
            FORMATTING_FEATURES.append(feature)
        FORMATTERS.add(None, (lambda text, record: formatter.format(Context.of(feature, record), text)
                           if not record or (feature.enabled(record) and wanted(formatter, feature, record, None, timed=False)) else text,
                           formatter.surfaces))


def refusals(interceptor: type) -> str:
    return f"refused.{interceptor.__name__}"


def limited(context: AgentContext, interceptor: ToolInterceptor, refused: str) -> str:
    key = refusals(type(interceptor))
    limit = max(0, int(context.settings[interceptor.limit]))
    aside = max(0, int(context.settings[interceptor.steps_aside])) if interceptor.steps_aside else 0
    count = int(context.state.get(key, 0))
    if not refused:
        count = 0
    elif aside:
        count = count % (limit + aside) + 1
    else:
        count += 1
    context.state.set(key, count)
    return refused if count <= limit else ""


def hooked(feature, call: HookCall) -> AgentContext:
    return AgentContext.of(feature, call.record, call.row, call.provider, call.hook)


class AgentHooks:
    def __init__(self, feature):
        self.feature = feature
        self.guards: list[Guard] = []

    def append_to_line(self, on: str, addition) -> None:
        APPENDS.add(None, addition, key=on)

    def interceptor(self, interceptor: ToolInterceptor, expects=()) -> None:
        PROMISED.add(Promise(self.feature, "interceptor", type(interceptor).__name__, interceptor, object, tuple(expects)))
        feature, guard = self.feature, Guard.of(interceptor)
        self.guards.append(guard)

        def policy(call: HookCall) -> str:
            if call.hook.tool.loads_skill:
                return ""
            context = hooked(feature, call)
            if not feature.enabled(call.record) or not wanted(interceptor, feature, call.record, call.row, timed=False):
                return ""
            refused = interceptor.intercept(context, call.hook.tool) or ""
            return limited(context, interceptor, refused) if interceptor.limit else refused
        policy.guard = guard
        policies(interceptor.runs).add(None, policy)

    def canceler(self, canceler: Canceler, expects=()) -> None:
        feature, guard = self.feature, Guard.of(canceler)
        PROMISED.add(Promise(feature, "canceler", type(canceler).__name__, canceler, object, tuple(expects)))
        self.guards.append(guard)

        def cancel(call: HookCall, data) -> str:
            if not feature.enabled(call.record):
                return ""
            return canceler.cancel(hooked(feature, call), data) or ""
        cancel.guard = guard
        CANCELERS.add(None, cancel, key=canceler.event)

    def responder(self, event: str, respond, expects=()) -> None:
        PROMISED.add(Promise(self.feature, "responder", getattr(respond, "__name__", event), respond, object, tuple(expects)))
        RESPONDERS.add(None, respond, key=event)


class Commands:
    def __init__(self, feature):
        self.feature = feature

    def add(self, type_: str, command: Command, expects=()) -> None:
        feature = self.feature
        PROMISED.add(Promise(feature, "command", type(command).__name__, command, object, tuple(expects)))

        def call(controller, *args, **kwargs):
            if not feature.enabled(controller.record):
                raise Refused(f"the {feature.name} feature is off: switch it on in Settings, or with journal feature switch {feature.name}")
            if command.user_only and controller.actor != USER:
                raise Refused(f"only the user may {type_} {command.name}: they do it from the viewer")
            return command.run(Context.of(feature, controller.record), controller, *args, **kwargs)
        given = list(inspect.signature(command.run).parameters.values())[2:]
        call.__signature__ = inspect.Signature([inspect.Parameter("controller", inspect.Parameter.POSITIONAL_OR_KEYWORD), *given])
        call.__name__ = command.name
        call.network = command.network
        call.runs_commands = command.runs_commands
        COMMANDS.setdefault(type_, {})[command.name] = call

    def refuse(self, write: type, refuser: Refuser, expects) -> None:
        """Raises Refused before the write reaches the funnel; a hold after the fact is no hold, so this stays synchronous."""
        REGISTERED.add(Registration.read(REFUSE, write, refuser, expects, self.feature.name))

    def intercept(self, action: str, interceptor: ActionInterceptor, expects=()) -> None:
        feature = self.feature
        PROMISED.add(Promise(feature, "action_interceptor", type(interceptor).__name__, interceptor, object, tuple(expects)))
        HANDLERS.setdefault(action, []).append(
            lambda controller, **args: interceptor.intercept(Context.of(feature, controller.record), controller, **args) if feature.enabled(controller.record) else None)


class Routes:
    def __init__(self, feature):
        self.feature = feature

    def add(self, *handlers, expects=()) -> None:
        for one in handlers:
            PROMISED.add(Promise(self.feature, "route", getattr(one, "__name__", type(one).__name__), one, object, tuple(expects)))
        for handler in handlers:
            FEATURE_ROUTES.add(None, handler.route)
