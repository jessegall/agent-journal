from collections.abc import Callable
from typing import TextIO

from engine.caller.caller_request import CallerRequest
from engine.cli.console import USAGE_CODE, Console
from engine.cli.module_sync_line import SYNC_ARGV, ModuleSyncLine
from engine.cli.module_add_line import MODULE_ADDITION_ARGUMENTS, ModuleAddLine
from engine.cli.module_remove_line import MODULE_REMOVAL_ARGUMENTS, ModuleRemoveLine
from engine.container.container import Container
from core.base.database.database import BUSY_TIMEOUT_SECONDS, Database
from core.base.database.reported_findings import ReportedFindings
from core.base.database.request_watch import RequestWatch
from engine.time.deadline import Deadline
from engine.container.journal_container import opened_container, synced_container
from engine.journal.journal_home import JournalHome
from engine.cli.caller_stream import CallerStream
from engine.command.script_policy import ScriptPolicy
from engine.listener.commit_listener_runner import CommitListenerRunner
from core.base.module.code_fingerprint import CodeFingerprint
from core.base.module.performance_tools import PerformanceTools
from engine.performance.route_cost_tool import RouteCostTool
from core.base.registry.stale_registry_error import StaleRegistryError
from engine.caller.caller import Caller
from engine.time.timing import Timing
from engine.request.request_queue import RequestQueue


def ignore_completed(container: Container, argv: list[str]) -> None:
    return None


class LineRun:
    """Runs one journal command line for a caller on a journal's folder, as a direct run and the server both
    do: a module sync on an opened database, any other line on a synced one that waits for another writer up
    to its busy timeout, or the time left before the caller's deadline, and the database closed after. The
    server hands it the runner its commit listeners go to and the request's timing, stamped once the container
    is built; a direct run has no timing set, so it stamps nothing. Each line runs inside the request watch
    of the container, which shares the findings already reported with every other line of this run."""

    def __init__(self, home: JournalHome, busy_timeout_seconds: float = BUSY_TIMEOUT_SECONDS, listener_runner: CommitListenerRunner | None = None,
                 reported: ReportedFindings | None = None, request_queue: RequestQueue | None = None,
                 completion_callback: Callable[[Container, list[str]], None] = ignore_completed) -> None:
        self.home, self.busy_timeout_seconds, self.listener_runner = home, busy_timeout_seconds, listener_runner
        self.reported = reported or ReportedFindings()
        self.fingerprint = CodeFingerprint()
        self.request_queue = request_queue
        self.completion_callback = completion_callback

    def run(self, argv: list[str], request: CallerRequest, stream: TextIO, deadline: Deadline | None = None,
            timing: Timing | None = None) -> int:
        if argv[:2] in (SYNC_ARGV, MODULE_ADDITION_ARGUMENTS):
            container = opened_container(self.home)
            try:
                line = ModuleAddLine if argv[:2] == MODULE_ADDITION_ARGUMENTS else ModuleSyncLine
                return container.get(line).run(argv, stream)
            finally:
                self.close(container, argv)
        try:
            container = self.synced(deadline, timing)
        except StaleRegistryError as error:
            stream.write(f"{error}\n")
            return USAGE_CODE
        container.bind(CallerStream, CallerStream(stream, "--json" in argv))
        tools = container.get(PerformanceTools)
        start_points = tools.begin()
        try:
            with container.get(RequestWatch).watching(argv):
                if argv[:2] == MODULE_REMOVAL_ARGUMENTS:
                    return container.get(ModuleRemoveLine).run(argv, request, stream)
                return container.get(Console).requested_run(argv, request, stream)
        finally:
            cost = tools.cost(start_points)
            if cost is not None:
                tools.run(RouteCostTool, "/cli", cost)
            self.close(container, argv)

    def run_as(self, argv: list[str], checked_caller: Callable[[Container], Caller], stream: TextIO) -> int:
        try:
            container = self.synced(None, None)
        except StaleRegistryError as error:
            stream.write(f"{error}\n")
            return USAGE_CODE
        try:
            with container.get(RequestWatch).watching(argv):
                return container.get(Console).run(argv, checked_caller(container), stream)
        finally:
            self.close(container, argv)

    def close(self, container: Container, argv: list[str]) -> None:
        try:
            self.completion_callback(container, argv)
        finally:
            container.get(Database).close()

    def synced(self, deadline: Deadline | None, timing: Timing | None) -> Container:
        container = synced_container(self.home)
        container.bind(CodeFingerprint, self.fingerprint)
        container.bind(ReportedFindings, self.reported)
        if self.request_queue is not None:
            container.bind(RequestQueue, self.request_queue)
        remaining_seconds = deadline.remaining_seconds() if deadline else None
        container.get(Database).set_busy_timeout(self.busy_timeout_seconds if remaining_seconds is None else remaining_seconds)
        if deadline is not None:
            container.bind(Deadline, deadline)
        if self.listener_runner is not None:
            container.bind(CommitListenerRunner, self.listener_runner)
            container.bind(ScriptPolicy, ScriptPolicy(guards_run=True))
        if timing is not None:
            container.bind(Timing, timing)
        container.get(Timing).stamp("command_started")
        return container
