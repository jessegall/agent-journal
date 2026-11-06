import sqlite3
import traceback
from time import perf_counter
from collections.abc import Mapping

from core.base.type_guards import is_mapping
from core.base.database.database import Database
from core.base.database.reported_findings import ReportedFindings
from core.base.database.request_watch import RequestWatch
from core.base.container import Container
from core.base.driver.hook_event import HookEvent
from core.base.driver.old_hook_runner_error import OldHookRunnerError
from core.base.driver.hook_reply import HookReply
from core.base.driver.hook_route import HookRoute
from core.base.provider.providers import Providers
from core.base.journal_container import synced_database_container
from core.base.module.code_fingerprint import CodeFingerprint
from core.base.module.module_finder import ModuleFinder
from core.base.registry.registry import Registry
from core.base.registry.stale_registry_error import StaleRegistryError
from core.base.timing import Timing
from core.base.module.performance_tools import PerformanceTools
from core.base.performance.route_cost_tool import RouteCostTool
from core.modules.developer.support.hook_request_log import HookRequestLog
from core.modules.drivers.models.enums.hook_answer import HookAnswer
from server.hook.raw_hook_body import RawHookBody, is_raw_body
from server.hook.hook_headers import HookHeaders
from server.hook.hook_database_busy_error import HookDatabaseBusyError
from server.hook.queue_priority import QueuePriority
from server.server_context import ServerContext


STOP_NAME = "stop"
TOOL_NAME = "pre_tool_use"
LEAST_BUSY_SECONDS = 0.1
REQUEST_LOG_BUSY_SECONDS = 0.05
ROLE_FIELD = "role"
SESSION_FIELD = "session"
MAIN_ROLE = "main"
UNCHECKED_TOOL = "the journal could not check this tool, so it did not run: {reason}. Run it once more. If that is refused as well, stop and write in your report that the journal does not answer."


def is_stop_body(data: object) -> bool:
    if not is_mapping(data):
        return False
    return STOP_NAME in (str(data.get("event")).lower(), str(data.get("hook_event_name")).lower())


def queue_priority(data: object) -> QueuePriority:
    return QueuePriority.AGENT_HOOK if is_mapping(data) and data.get(ROLE_FIELD) not in (None, "", MAIN_ROLE) else QueuePriority.MAIN_AGENT_HOOK


def hook_owner(data: object) -> str:
    return str(data.get(SESSION_FIELD, "")) if is_mapping(data) else ""


def requires_check(data: object) -> bool:
    return is_mapping(data) and data.get("event") == TOOL_NAME and data.get(ROLE_FIELD) not in (None, "", MAIN_ROLE)


class HookEndpoint:
    """Answers POST /hook: reads a hook's object, prepared or raw, and runs it through the hook
    route on a synced journal over the connection the server's hooks share, waiting for another
    writer up to the hook limit, which leaves the client time to hear the answer. A stale registry,
    a wait past the limit or a fault outside the rules lets the hook through with one line, except a
    stop, which is refused, since a stop the journal cannot check may leave work open, and a tool of
    a worker or helper, which never runs unchecked; a fault goes to the server log. The request log
    takes no time from other hooks: a record that has to wait is dropped."""

    def __init__(self, timing: Timing, context: ServerContext) -> None:
        self.timing, self.context = timing, context

    def answer(self, data: object, program: str, headers: Mapping[str, str]) -> HookReply:
        started_at = perf_counter()
        try:
            priority = queue_priority(data)
            limit_seconds = self.context.agent_hook_limit_seconds if priority is QueuePriority.AGENT_HOOK else self.context.hook_limit_seconds
            with self.context.hook_database.used(priority, limit_seconds, hook_owner(data)) as database:
                self.timing.stamp("hook_locked")
                return self.routed_answer(data, program, headers, database, started_at, limit_seconds)
        except (HookDatabaseBusyError, OldHookRunnerError) as error:
            return self.unchecked(data, error)
        finally:
            self.timing.stamp("hook_answered")
            self.context.listener_thread.wake()

    def routed_answer(self, data: object, program: str, headers: Mapping[str, str], database: Database, started_at: float, limit_seconds: float) -> HookReply:
        try:
            container = synced_database_container(self.context.home, database)
            container.get(Registry).require_current(container.get(CodeFingerprint).text(container.get(ModuleFinder).modules()))
        except StaleRegistryError as error:
            return self.unchecked(data, error)
        container.bind(Timing, self.timing)
        container.bind(ReportedFindings, self.context.reported_findings)
        self.timing.stamp("hook_synced")
        outcome = HookAnswer.REFUSED
        try:
            with container.get(RequestWatch).watching(["hook", program]):
                reply = self.prepared_answer(data, program, headers, database, container, started_at + limit_seconds)
            outcome = HookAnswer.REFUSED if reply.refusal else HookAnswer.ALLOWED
            return reply
        finally:
            try:
                database.set_busy_timeout(REQUEST_LOG_BUSY_SECONDS)
                container.get(HookRequestLog).record(program, headers, data, (perf_counter() - started_at) * 1000, outcome)
            except sqlite3.Error as error:
                self.context.files.log_line(f"request recording failed: {error}")

    def prepared_answer(self, data: object, program: str, headers: Mapping[str, str], database: Database, container: Container, deadline: float) -> HookReply:
        event = self.event(data, program, headers, container.get(Providers))
        database.set_busy_timeout(max(deadline - perf_counter(), LEAST_BUSY_SECONDS))
        tools = container.get(PerformanceTools)
        start_points = tools.begin()
        try:
            route = container.get(HookRoute)
            self.timing.stamp("route_ready")
            return route.answer(event)
        except sqlite3.OperationalError as error:
            if error.sqlite_errorcode == sqlite3.SQLITE_BUSY:
                return self.unchecked(data, error)
            return self.failure(data, error)
        except Exception as error:
            return self.failure(data, error)
        finally:
            cost = tools.cost(start_points)
            if cost is not None:
                tools.run(RouteCostTool, "/hook", cost)

    def event(self, data: object, program: str, headers: Mapping[str, str], providers: Providers) -> HookEvent:
        if is_raw_body(data):
            event = RawHookBody.parsed(data).event(program, providers.provider(program).hook_events, HookHeaders.parsed(headers))
        else:
            event = HookEvent.parsed(data)
            providers.provider(event.program)
        self.timing.stamp("hook_read")
        return event

    def failure(self, data: object, error: Exception) -> HookReply:
        self.context.files.log_line("".join(traceback.format_exception(error)))
        if is_stop_body(data):
            return HookReply(refusal=f"the journal failed on this stop and holds it: {type(error).__name__}: {error}")
        if requires_check(data):
            return HookReply(refusal=UNCHECKED_TOOL.format(reason=f"{type(error).__name__}: {error}"))
        return HookReply.allowed(f"the journal failed on this hook and let it through: {type(error).__name__}: {error}")

    def unchecked(self, data: object, reason: Exception) -> HookReply:
        if is_stop_body(data):
            return HookReply(refusal=f"the journal could not check this stop and holds it: {reason}")
        if requires_check(data):
            return HookReply(refusal=UNCHECKED_TOOL.format(reason=reason))
        return HookReply.allowed(f"the journal let this through unchecked: {reason}")

