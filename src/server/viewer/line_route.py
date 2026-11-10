import io
import json
from time import perf_counter

from engine.database.repeated_lines import RepeatedLines
from engine.database.request_watch import RequestWatch
from engine.request.request_queue import RequestQueue
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.database.kept_rows import KeptRows
from engine.query.queries import Queries
from core.modules.actors.models.actor_record import ActorRecord
from engine.cli.console import USAGE_CODE, Console
from engine.cli.line_run import LineRun, ignore_completed
from collections.abc import Callable
from engine.cli.subcommand_lookup import SubcommandLookup
from engine.cli.usage_error import UsageError
from engine.container.container import Container
from engine.database.database import Database
from engine.database.reported_findings import ReportedFindings
from engine.environment.environment_names import EnvironmentNames
from engine.journal.journal_home import JournalHome
from engine.errors.refusal import Refusal
from engine.caller.caller import Caller
from core.base.registry.stale_registry_error import StaleRegistryError
from engine.subcommand.subcommand import Subcommand
from core.modules.viewer.commands.support.window_lines import WindowLines
from server.endpoints.cli_endpoint import CLI_LIMIT_SECONDS
from server.listener_thread import ListenerThread
from server.listener_wake import ListenerWake
from server.viewer.line_answer import LineAnswer
from server.viewer.share_refusal import ShareRefusal
from server.viewer.share_scope import ShareScope
from server.viewer.shared_row import SharedRow
from server.viewer.timed_line_answer import TimedLineAnswer
from server.viewer.viewer_line_request import ViewerLineRequest
from server.viewer.viewer_lines_request import ViewerLinesRequest

REFUSED_CODE = 1
FLAG_SEPARATOR = "--"


class LineRoute:
    """Checks and runs viewer lines, sharing one read container for a batch and returning each line's answer."""

    def __init__(self, home: JournalHome, listener_thread: ListenerThread, reported: ReportedFindings, request_queue: RequestQueue | None = None, completion_callback: Callable[[Container, list[str]], None] = ignore_completed) -> None:
        self.line_run = LineRun(home, CLI_LIMIT_SECONDS, ListenerWake(listener_thread), reported, request_queue, completion_callback)

    def answer(self, window: str, argv: list[str], person_id: int, environment: str, shared: SharedRow | None = None) -> LineAnswer:
        return self.timed_single_answer(window, argv, person_id, environment, shared).answer

    def timed_single_answer(self, window: str, argv: list[str], person_id: int, environment: str, shared: SharedRow | None = None) -> TimedLineAnswer:
        started_at = perf_counter()
        try:
            container = self.line_run.synced(None, None)
        except StaleRegistryError as error:
            return TimedLineAnswer(LineAnswer(USAGE_CODE, error=str(error)), (perf_counter() - started_at) * 1000)
        try:
            answer = self.run_line(container, window, argv, person_id, environment, shared)
            return TimedLineAnswer(answer, (perf_counter() - started_at) * 1000, container.get(Database).repeated_work.points())
        finally:
            self.line_run.close(container, argv)

    def answers(self, request: ViewerLinesRequest, person_id: int, shared: SharedRow | None = None) -> list[LineAnswer]:
        return [timed.answer for timed in self.timed_answers(request, person_id, shared)]

    def timed_answers(self, request: ViewerLinesRequest, person_id: int, shared: SharedRow | None = None) -> list[TimedLineAnswer]:
        if not request.lines:
            return []
        try:
            container = self.line_run.synced(None, None)
        except StaleRegistryError as error:
            return [TimedLineAnswer(LineAnswer(USAGE_CODE, error=str(error)), 0.0) for _ in request.lines]
        try:
            return [self.timed_answer(container, line, person_id, shared) for line in request.lines]
        finally:
            self.line_run.close(container, [])

    def timed_answer(self, container: Container, request: ViewerLineRequest, person_id: int, shared: SharedRow | None) -> TimedLineAnswer:
        initial_values = container.get(Database).repeated_work.points()
        started_at = perf_counter()
        try:
            if not container.get(WindowLines).parsed(request.window, request.line).is_read:
                return self.timed_single_answer(request.window, request.line, person_id, request.environment, shared)
        except UsageError as error:
            return TimedLineAnswer(LineAnswer(USAGE_CODE, error=str(error)), (perf_counter() - started_at) * 1000,
                                   container.get(Database).repeated_work.points().minus(initial_values))
        except ShareRefusal as refusal:
            return TimedLineAnswer(LineAnswer(REFUSED_CODE, error=refusal.reason), (perf_counter() - started_at) * 1000,
                                   container.get(Database).repeated_work.points().minus(initial_values))
        answer = self.batch_answer(container, request, person_id, shared)
        return TimedLineAnswer(answer, (perf_counter() - started_at) * 1000, container.get(Database).repeated_work.points().minus(initial_values))

    def batch_answer(self, container: Container, request: ViewerLineRequest, person_id: int, shared: SharedRow | None) -> LineAnswer:
        try:
            if container.get(WindowLines).parsed(request.window, request.line).is_read:
                return self.run_line(container, request.window, request.line, person_id, request.environment, shared)
            return self.answer(request.window, request.line, person_id, request.environment, shared)
        except UsageError as error:
            return LineAnswer(USAGE_CODE, error=str(error))
        except ShareRefusal as refusal:
            return LineAnswer(REFUSED_CODE, error=refusal.reason)

    def read_lines(self) -> list[str]:
        container = self.line_run.synced(None, None)
        try:
            lookup = container.get(SubcommandLookup)
            return [f"{command} {subcommand}" for command in lookup.cli_names() for subcommand in lookup.names(command) if not isinstance(lookup.subcommand(command, subcommand), Subcommand)]
        finally:
            container.get(Database).close()

    def report_repeated_lines(self, repeated: RepeatedLines) -> None:
        container = self.line_run.synced(None, None)
        try:
            container.get(RequestWatch).report_repeated_lines(repeated)
        finally:
            container.get(Database).close()

    @staticmethod
    def actor_type(container: Container, actor_id: int) -> ActorType:
        return container.get(KeptRows).scoped_current(lambda: container.get(Queries).query(ActorRecord).find(actor_id).type, name=f"viewer.actor_type:{actor_id}")

    def run_line(self, container: Container, window: str, argv: list[str], person_id: int, environment: str, shared: SharedRow | None) -> LineAnswer:
        person, stream = Actor(person_id, self.actor_type(container, person_id)), io.StringIO()
        try:
            if shared is None:
                container.get(WindowLines).check(window, argv, person, environment)
            else:
                container.get(ShareScope).check(shared, argv, environment)
            caller = Caller(person, container.get(EnvironmentNames).environment_id(environment))
            with container.get(RequestWatch).watching_without_refusal(argv):
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
