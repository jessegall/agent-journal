import io
import json

from core.base.database.request_watch import RequestWatch
from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.cli.console import USAGE_CODE, Console
from core.base.cli.line_run import LineRun
from core.base.cli.usage_error import UsageError
from core.base.container import Container
from core.base.database.database import Database
from core.base.database.reported_findings import ReportedFindings
from core.base.environment_names import EnvironmentNames
from core.base.journal_home import JournalHome
from core.base.refusal import Refusal
from core.base.caller.caller import Caller
from core.base.registry.stale_registry_error import StaleRegistryError
from core.modules.viewer.commands.support.window_lines import WindowLines
from server.endpoints.cli_endpoint import CLI_LIMIT_SECONDS
from server.listener_thread import ListenerThread
from server.listener_wake import ListenerWake
from server.viewer.line_answer import LineAnswer
from server.viewer.share_refusal import ShareRefusal
from server.viewer.share_scope import ShareScope
from server.viewer.shared_row import SharedRow
from server.viewer.viewer_line_request import ViewerLineRequest
from server.viewer.viewer_lines_request import ViewerLinesRequest

REFUSED_CODE = 1
FLAG_SEPARATOR = "--"


class LineRoute:
    """Checks and runs viewer lines, sharing one read container for a batch and returning each line's answer."""

    def __init__(self, home: JournalHome, listener_thread: ListenerThread, reported: ReportedFindings) -> None:
        self.line_run = LineRun(home, CLI_LIMIT_SECONDS, ListenerWake(listener_thread), reported)

    def answer(self, window: str, argv: list[str], person_id: int, environment: str, shared: SharedRow | None = None) -> LineAnswer:
        try:
            container = self.line_run.synced(None, None)
        except StaleRegistryError as error:
            return LineAnswer(USAGE_CODE, error=str(error))
        try:
            return self.run_line(container, window, argv, person_id, environment, shared)
        finally:
            container.get(Database).close()

    def answers(self, request: ViewerLinesRequest, person_id: int, shared: SharedRow | None = None) -> list[LineAnswer]:
        if not request.lines:
            return []
        try:
            container = self.line_run.synced(None, None)
        except StaleRegistryError as error:
            return [LineAnswer(USAGE_CODE, error=str(error)) for _ in request.lines]
        try:
            return [self.batch_answer(container, line, person_id, shared) for line in request.lines]
        finally:
            container.get(Database).close()

    def batch_answer(self, container: Container, request: ViewerLineRequest, person_id: int, shared: SharedRow | None) -> LineAnswer:
        try:
            if container.get(WindowLines).parsed(request.window, request.line).is_read:
                return self.run_line(container, request.window, request.line, person_id, request.environment, shared)
            return self.answer(request.window, request.line, person_id, request.environment, shared)
        except UsageError as error:
            return LineAnswer(USAGE_CODE, error=str(error))
        except ShareRefusal as refusal:
            return LineAnswer(REFUSED_CODE, error=refusal.reason)

    def run_line(self, container: Container, window: str, argv: list[str], person_id: int, environment: str, shared: SharedRow | None) -> LineAnswer:
        person, stream = Actor(person_id, ActorType.USER), io.StringIO()
        try:
            if shared is None:
                container.get(WindowLines).check(window, argv, person, environment)
            else:
                container.get(ShareScope).check(shared, argv, environment)
            caller = Caller(person, container.get(EnvironmentNames).environment_id(environment))
            with container.get(RequestWatch).watching(argv):
                code = container.get(Console).run(self.json_line(argv), caller, stream)
        except UsageError as error:
            return LineAnswer(USAGE_CODE, error=str(error))
        except ShareRefusal:
            raise
        except Refusal as refusal:
            return LineAnswer(REFUSED_CODE, error=refusal.reason)
        if code != 0:
            return LineAnswer(code, error=stream.getvalue().strip())
        return LineAnswer(code, value=json.loads(stream.getvalue() or "null"))

    @staticmethod
    def json_line(argv: list[str]) -> list[str]:
        flags_end = argv.index(FLAG_SEPARATOR) if FLAG_SEPARATOR in argv else len(argv)
        return [*argv[:flags_end], "--json", *argv[flags_end:]]
