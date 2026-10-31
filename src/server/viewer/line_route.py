import io
import json

from core.base.actor import Actor, ActorType
from core.base.cli.console import USAGE_CODE
from core.base.cli.line_run import LineRun
from core.base.cli.subcommand_lookup import UsageError
from core.base.container import Container
from core.base.environment_names import EnvironmentNames
from core.base.journal_home import JournalHome
from core.base.refusal import Refusal
from core.base.subcommand.caller import Caller
from core.modules.viewer.window_lines import WindowLines
from server.endpoints.cli_endpoint import CLI_LIMIT_SECONDS
from server.listener_thread import ListenerThread
from server.listener_wake import ListenerWake
from server.viewer.line_answer import LineAnswer

REFUSED_CODE = 1


class LineRoute:
    """Answers POST /api/line: checks one command line against the window that sends it and the person at
    the viewer, runs it through LineRun with --json as that person in the request's environment, and gives
    back its exit code and its JSON value, or the reason it did not run."""

    def __init__(self, home: JournalHome, listener_thread: ListenerThread) -> None:
        self.line_run = LineRun(home, CLI_LIMIT_SECONDS, ListenerWake(listener_thread))

    def answer(self, window: str, argv: list[str], person_id: int, environment: str) -> LineAnswer:
        person, stream = Actor(person_id, ActorType.USER), io.StringIO()

        def checked_caller(container: Container) -> Caller:
            container.get(WindowLines).check(window, argv, person, environment)
            return Caller(person, container.get(EnvironmentNames).environment_id(environment))

        try:
            code = self.line_run.run_as([*argv, "--json"], checked_caller, stream)
        except UsageError as error:
            return LineAnswer(USAGE_CODE, None, str(error))
        except Refusal as refusal:
            return LineAnswer(REFUSED_CODE, None, refusal.reason)
        if code != 0:
            return LineAnswer(code, None, stream.getvalue().strip())
        return LineAnswer(code, json.loads(stream.getvalue() or "null"), "")
