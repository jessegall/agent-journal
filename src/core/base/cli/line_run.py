from collections.abc import Callable
from typing import TextIO

from core.base.caller.caller_request import CallerRequest
from core.base.cli.console import USAGE_CODE, Console
from core.base.cli.module_sync_line import SYNC_ARGV, ModuleSyncLine
from core.base.cli.module_add_line import MODULE_ADDITION_ARGUMENTS, ModuleAddLine
from core.base.cli.module_remove_line import MODULE_REMOVAL_ARGUMENTS, ModuleRemoveLine
from core.base.container import Container
from core.base.database.database import BUSY_TIMEOUT_SECONDS, Database
from core.base.database.reported_findings import ReportedFindings
from core.base.database.request_watch import RequestWatch
from core.base.deadline import Deadline
from core.base.journal_container import opened_container, synced_container
from core.base.journal_home import JournalHome
from core.base.listener.commit_listener_runner import CommitListenerRunner
from core.base.module.code_fingerprint import CodeFingerprint
from core.base.module.performance_tools import PerformanceTools
from core.base.performance.route_cost_tool import RouteCostTool
from core.base.registry.stale_registry_error import StaleRegistryError
from core.base.caller.caller import Caller
from core.base.timing import Timing


class LineRun:
    """Runs one journal command line for a caller on a journal's folder, as a direct run and the server both
    do: a module sync on an opened database, any other line on a synced one that waits for another writer up
    to its busy timeout, or the time left before the caller's deadline, and the database closed after. The
    server hands it the runner its commit listeners go to and the request's timing, stamped once the container
    is built; a direct run has no timing set, so it stamps nothing. Each line runs inside the request watch of the
    container, which shares the findings already reported with every other line of this run."""

    def __init__(self, home: JournalHome, busy_timeout_seconds: float = BUSY_TIMEOUT_SECONDS, listener_runner: CommitListenerRunner | None = None,
                 reported: ReportedFindings | None = None) -> None:
        self.home, self.busy_timeout_seconds, self.listener_runner = home, busy_timeout_seconds, listener_runner
        self.reported = reported or ReportedFindings()
        self.fingerprint = CodeFingerprint()

    def run(self, argv: list[str], request: CallerRequest, stream: TextIO, deadline: Deadline | None = None,
            timing: Timing | None = None) -> int:
        if argv[:2] in (SYNC_ARGV, MODULE_ADDITION_ARGUMENTS):
            container = opened_container(self.home)
            try:
                line = ModuleAddLine if argv[:2] == MODULE_ADDITION_ARGUMENTS else ModuleSyncLine
                return container.get(line).run(argv, stream)
            finally:
                container.get(Database).close()
        try:
            container = self.synced(deadline, timing)
        except StaleRegistryError as error:
            stream.write(f"{error}\n")
            return USAGE_CODE
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
            container.get(Database).close()

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
            container.get(Database).close()

    def synced(self, deadline: Deadline | None, timing: Timing | None) -> Container:
        container = synced_container(self.home)
        container.bind(CodeFingerprint, self.fingerprint)
        container.bind(ReportedFindings, self.reported)
        remaining_seconds = deadline.remaining_seconds() if deadline else None
        container.get(Database).set_busy_timeout(self.busy_timeout_seconds if remaining_seconds is None else remaining_seconds)
        if deadline is not None:
            container.bind(Deadline, deadline)
        if self.listener_runner is not None:
            container.bind(CommitListenerRunner, self.listener_runner)
        if timing is not None:
            container.bind(Timing, timing)
        container.get(Timing).stamp("command_started")
        return container
