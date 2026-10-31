import io
import json

from core.base.actor import Actor, ActorType
from core.base.cli.console import USAGE_CODE, Console
from core.base.cli.subcommand_lookup import UsageError
from core.base.database.database import Database
from core.base.environment_names import EnvironmentNames
from core.base.journal_container import synced_container
from core.base.journal_home import JournalHome
from core.base.listener.commit_listener_runner import CommitListenerRunner
from core.base.refusal import Refusal
from core.base.subcommand.caller import Caller
from core.modules.viewer.window_lines import WindowLines
from server.listener_thread import ListenerThread, ListenerWake
from server.viewer.line_answer import LineAnswer

REFUSED_CODE = 1


class LineRoute:
    """Answers POST /api/line: checks one command line against the window that sends it and the person at
    the viewer, runs it with --json as that person in the request's environment, and gives back its exit
    code and its JSON value, or the reason it did not run."""

    def __init__(self, home: JournalHome, listener_thread: ListenerThread) -> None:
        self.home, self.listener_thread = home, listener_thread

    def answer(self, window: str, argv: list[str], person_id: int, environment: str) -> LineAnswer:
        container = synced_container(self.home)
        container.bind(CommitListenerRunner, ListenerWake(self.listener_thread))
        person, stream = Actor(person_id, ActorType.USER), io.StringIO()
        try:
            container.get(WindowLines).check(window, argv, person, environment)
            caller = Caller(person, container.get(EnvironmentNames).environment_id(environment))
            code = container.get(Console).run([*argv, "--json"], caller, stream)
        except UsageError as error:
            return LineAnswer(USAGE_CODE, None, str(error))
        except Refusal as refusal:
            return LineAnswer(REFUSED_CODE, None, refusal.reason)
        finally:
            container.get(Database).close()
        if code != 0:
            return LineAnswer(code, None, stream.getvalue().strip())
        return LineAnswer(code, json.loads(stream.getvalue() or "null"), "")
