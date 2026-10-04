import inspect
from typing import get_type_hints

from controllers.base import COMMANDS, HANDLERS
from controllers.types import Agents
from engine import bus
from engine.events.base import AgentEvent
from engine.gates import AFTERWARDS, CANCELERS, POLICIES, RESPONDERS, HookCall
from engine.reach import Guard
from engine.wording import APPENDS
from features.format import FORMATTERS
from features.parts import ActionInterceptor, AgentContext, Canceler, Command, Context, Handler, TextFormatter, ToolInterceptor
from resources.base import SYSTEM, Refused


def wanted(part, feature, record, row, timed: bool = True) -> bool:
    if part.behaviour is None:
        return True
    if not timed or not feature.cadence(record, part.behaviour):
        return feature.on(record, part.behaviour)
    return bool(row) and feature.due(record, row, part.behaviour)


def agent_row(record, n: int):
    if record.memo is None:
        return Agents(record, actor=SYSTEM).load(n)
    key = ("agent row", n)
    if key not in record.memo:
        record.memo[key] = Agents(record, actor=SYSTEM).load(n)
    return record.memo[key]


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
            row = agent_row(record, typed.agent) if isinstance(typed, AgentEvent) else None
            if wanted(handler, feature, record, row):
                handler.handle(AgentContext.of(feature, record, row) if row else Context.of(feature, record), typed)
        self.names.append(kind.name())
        bus.on(kind.on, run, enabled=feature.enabled)


class Client:
    def __init__(self, feature):
        self.feature = feature

    def formatter(self, formatter: TextFormatter) -> None:
        feature = self.feature
        FORMATTERS.append((lambda text, record: formatter.format(Context.of(feature, record), text)
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
        APPENDS.setdefault(on, []).append(addition)

    def interceptor(self, interceptor: ToolInterceptor) -> None:
        feature, guard = self.feature, Guard.of(interceptor)
        self.guards.append(guard)

        def policy(call: HookCall) -> str:
            if call.hook.tool.loads_skill and not interceptor.before_checks:
                return ""
            context = hooked(feature, call)
            if not feature.enabled(call.record) or not wanted(interceptor, feature, call.record, call.row, timed=False):
                return ""
            refused = interceptor.intercept(context, call.hook.tool) or ""
            return limited(context, interceptor, refused) if interceptor.limit else refused
        policy.guard = guard
        if interceptor.before_checks:
            POLICIES.insert(0, policy)
            return
        (POLICIES if interceptor.refuses else AFTERWARDS).append(policy)

    def canceler(self, canceler: Canceler) -> None:
        feature, guard = self.feature, Guard.of(canceler)
        self.guards.append(guard)

        def cancel(call: HookCall, data) -> str:
            if not feature.enabled(call.record):
                return ""
            return canceler.cancel(hooked(feature, call), data) or ""
        cancel.guard = guard
        CANCELERS.setdefault(canceler.event, []).append(cancel)

    def responder(self, event: str, respond) -> None:
        RESPONDERS.setdefault(event, []).append(respond)


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
        call.network = command.network
        COMMANDS.setdefault(type_, {})[command.name] = call

    def intercept(self, action: str, interceptor: ActionInterceptor) -> None:
        feature = self.feature
        HANDLERS.setdefault(action, []).append(
            lambda controller, **args: interceptor.intercept(Context.of(feature, controller.record), controller, **args) if feature.enabled(controller.record) else None)
