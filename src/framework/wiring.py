import inspect

from controllers.base import COMMANDS, HANDLERS
from events.asking import TextFormatting
from engine.wording import APPENDS, Addition
from framework.format import FORMATTING_FEATURES
from framework.parts import ActionInterceptor, Command, Context
from resources.base import USER, Refused
from framework.routing import FEATURE_ROUTES
from receiving import ANSWER, HANDLE, LISTEN, REFUSE, REGISTERED, Answerer, Handler, Listener, Refuser, Registration
from framework.promises import PROMISED, Promise


class Events:
    def __init__(self, feature):
        self.feature = feature
        self.names: list[str] = []

    def listen(self, event: type, listener: Listener, expects) -> None:
        """Reads the event and dispatches the facts it recognises; read-only, in the tick the event belongs to."""
        self.register(LISTEN, event, listener, expects)

    def handle(self, fact: type, handler: Handler, expects, after: tuple[str, ...] = ()) -> None:
        """Acts on the fact in the next tick, inside that tick's transaction; after names the handlers on this fact it must follow, by name, since importing another feature is forbidden."""
        self.register(HANDLE, fact, handler, expects, after)

    def answer(self, request: type, answerer: Answerer, expects) -> None:
        """Answers the request synchronously and read-only, before anything about it writes. A formatter's feature is one whose settings the formatted texts are cached by."""
        if request is TextFormatting and self.feature not in FORMATTING_FEATURES:
            FORMATTING_FEATURES.append(self.feature)
        self.register(ANSWER, request, answerer, expects)

    def register(self, kind: str, event: type, receiver, expects, after: tuple[str, ...] = ()) -> None:
        """Holds one registration until the wiring is read. A feature loaded for its commands alone registers only what answers before a write, since a command's write is refused there or nowhere."""
        if self.feature.commands_only and kind not in (ANSWER, REFUSE):
            return
        self.names.append(event.__name__)
        REGISTERED.add(Registration.read(kind, event, receiver, expects, self.feature.name, after))


class AgentHooks:
    def __init__(self, feature):
        self.feature = feature

    def append_to_line(self, on: str, addition, instead: bool = False) -> None:
        APPENDS.add(None, Addition(addition, instead), key=on)


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
