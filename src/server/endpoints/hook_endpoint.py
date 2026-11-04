import sqlite3
import traceback
from time import perf_counter
from collections.abc import Mapping

from core.base.type_guards import is_mapping
from core.base.database.database import Database
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
from server.server_context import ServerContext


STOP_NAME = "stop"


def is_stop_body(data: object) -> bool:
    if not is_mapping(data):
        return False
    return STOP_NAME in (str(data.get("event")).lower(), str(data.get("hook_event_name")).lower())


class HookEndpoint:
    """Answers POST /hook: reads a hook's object, prepared or raw, and runs it through the hook
    route on a synced journal over the connection the server's hooks share, waiting for another
    writer up to the hook limit. A stale registry, a wait past the limit or a fault outside the
    rules lets the hook through with one line, except a stop, which is refused, since a stop the
    journal cannot check may leave work open; a fault goes to the server log."""

    def __init__(self, timing: Timing, context: ServerContext) -> None:
        self.timing, self.context = timing, context

    def answer(self, data: object, program: str, headers: Mapping[str, str]) -> HookReply:
        started_at = perf_counter()
        try:
            with self.context.hook_database.used(self.context.hook_limit_seconds) as database:
                self.timing.stamp("hook_locked")
                return self.routed_answer(data, program, headers, database, started_at)
        except (HookDatabaseBusyError, OldHookRunnerError) as error:
            return self.unchecked(data, error)
        finally:
            self.timing.stamp("hook_answered")
            self.context.listener_thread.wake()

    def routed_answer(self, data: object, program: str, headers: Mapping[str, str], database: Database, started_at: float) -> HookReply:
        try:
            container = synced_database_container(self.context.home, database)
            container.get(Registry).require_current(container.get(CodeFingerprint).text(container.get(ModuleFinder).modules()))
        except StaleRegistryError as error:
            return self.unchecked(data, error)
        container.bind(Timing, self.timing)
        self.timing.stamp("hook_synced")
        outcome = HookAnswer.REFUSED
        try:
            reply = self.prepared_answer(data, program, headers, database, container)
            outcome = HookAnswer.REFUSED if reply.refusal else HookAnswer.ALLOWED
            return reply
        finally:
            try:
                container.get(HookRequestLog).record(program, headers, data, (perf_counter() - started_at) * 1000, outcome)
            except sqlite3.Error as error:
                self.context.files.log_line(f"request recording failed: {error}")

    def prepared_answer(self, data: object, program: str, headers: Mapping[str, str], database: Database, container: Container) -> HookReply:
        event = self.event(data, program, headers, container.get(Providers))
        database.set_busy_timeout(self.context.hook_limit_seconds)
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
        return HookReply.allowed(f"the journal failed on this hook and let it through: {type(error).__name__}: {error}")

    def unchecked(self, data: object, reason: Exception) -> HookReply:
        if is_stop_body(data):
            return HookReply(refusal=f"the journal could not check this stop and holds it: {reason}")
        return HookReply.allowed(f"the journal let this through unchecked: {reason}")

