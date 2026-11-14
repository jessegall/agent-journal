from engine.database.database_busy import DatabaseBusy
import sqlite3
import traceback
from engine.serving.server_files import ServerFiles
from time import perf_counter
from collections.abc import Mapping

from engine.database.database import Database
from engine.database.reported_findings import ReportedFindings
from engine.database.request_watch import RequestWatch
from engine.enums.log_level import LogLevel
from engine.enums.process_type import ProcessType
from engine.file.file_access import FileAccess
from engine.process.door.request_records import REFUSED_HOOK_EXIT_CODE
from core.modules.processes.support.request_log import RequestLog
from core.modules.processes.support.request_log_entry import RequestLogEntry
from engine.container.container import Container
from engine.driver.hook_event import HookEvent
from engine.driver.errors.old_hook_runner_error import OldHookRunnerError
from engine.driver.hook_reply import HookReply
from engine.driver.hook_route import HookRoute
from engine.provider.providers import Providers
from engine.provider.transcript_entries import TranscriptEntries
from engine.module.journal_container import synced_database_container
from engine.module.code_fingerprint import CodeFingerprint
from engine.module.module_finder import ModuleFinder
from engine.registry.registry import Registry
from engine.registry.errors.stale_registry_error import StaleRegistryError
from engine.performance.timing import Timing
from engine.module.performance_tools import PerformanceTools
from engine.performance.route_cost_tool import RouteCostTool
from core.modules.developer.support.hook_request_log import HookRequestLog
from engine.enums.hook_answer import HookAnswer
from server.hook.hook_delivery_retries import HookDeliveryRetries
from server.execution.session_starters import SessionStarters
from server.hook.hook_sender import HookSender
from server.hook.raw_hook_body import RawHookBody, is_raw_body
from server.hook.hook_headers import HookHeaders
from server.errors.hook_database_busy_error import HookDatabaseBusyError
from engine.enums.execution_priority import ExecutionPriority
from server.hook.queue_request import QueueRequest
from server.context.server_context import ServerContext


LEAST_BUSY_SECONDS = 0.1
REQUEST_LOG_BUSY_SECONDS = 0.0
UNCHECKED_TOOL = "the journal could not check this, so it is held: {reason}. A worker or helper goes on with nothing the journal did not check. Try once more. If that is held as well, stop and write in your report that the journal does not answer."


SERVER_UPDATING = "the journal is updating: your line is held; try it again once the journal says it started"


class HookEndpoint:
    """Answers POST /hook: reads a hook's object, prepared or raw, and runs it through the hook
    route on a synced journal over the connection the server's hooks share, waiting for another
    writer up to the hook limit, which leaves the client time to hear the answer. A stale registry,
    a wait past the limit or a fault outside the rules lets the hook through with one line, except a
    stop, which is refused, since a stop the journal cannot check may leave work open, and a tool of
    a helper, which never runs unchecked; a fault goes to the server log. The request log
    takes no time from other hooks: a record that has to wait is dropped. A hook whose client left before
    its answer was written gives back the messages that answer told of, for the next hook to tell."""

    def __init__(self, timing: Timing, context: ServerContext) -> None:
        self.timing, self.context = timing, context

    def answer(self, data: object, program: str, headers: Mapping[str, str]) -> HookReply:
        started_at = perf_counter()
        sender = HookSender.parsed(data, self.context.hook_limit_seconds, self.context.agent_hook_limit_seconds, self.context.stop_limit_seconds,
                                   role_of=SessionStarters.shared(self.context.home).role)
        files = ServerFiles(self.context.home)
        if not files.phase().runs_programs:
            files.block_session(sender.session)
            self.kept_row(sender, program)
            return self.locked(sender)
        try:
            request = QueueRequest.started(sender.name, sender.event_name, sender.session)
            with self.context.hook_database.used(sender.priority, sender.limit_seconds, sender.owner, request) as database:
                self.timing.stamp("hook_locked")
                queued_ms = (perf_counter() - started_at) * 1000
                return self.routed_answer(data, program, headers, database, started_at, sender, queued_ms)
        except (HookDatabaseBusyError, OldHookRunnerError) as error:
            return self.unchecked(sender, error)
        finally:
            self.timing.stamp("hook_answered")
            self.context.listener_wakes.wake()

    def answer_lost(self, reply: HookReply) -> None:
        if reply.hook_call_id is None:
            return
        retries = HookDeliveryRetries(self.context.home)
        retries.keep(reply.hook_call_id)
        try:
            with self.context.hook_database.used(ExecutionPriority.IMMEDIATE, self.context.hook_limit_seconds) as database:
                database.set_busy_timeout(self.context.hook_limit_seconds)
                retries.retry(synced_database_container(self.context.home, database))
        except HookDatabaseBusyError as error:
            self.context.files.log_line(f"delivery reset for hook call {reply.hook_call_id} will retry at the next hook: {error}", LogLevel.WARNING)
        except sqlite3.OperationalError as error:
            if not DatabaseBusy.is_busy(error):
                raise
            self.context.files.log_line(f"delivery reset for hook call {reply.hook_call_id} will retry at the next hook: {error}", LogLevel.WARNING)

    def routed_answer(self, data: object, program: str, headers: Mapping[str, str], database: Database, started_at: float, sender: HookSender, queued_ms: float) -> HookReply:
        try:
            container = synced_database_container(self.context.home, database)
            container.get(Registry).require_current(container.get(CodeFingerprint).text(container.get(ModuleFinder).modules()))
        except StaleRegistryError as error:
            return self.unchecked(sender, error)
        container.bind(Timing, self.timing)
        container.bind(ReportedFindings, self.context.reported_findings)
        container.bind(TranscriptEntries, self.context.transcript_entries)
        self.timing.stamp("hook_synced")
        outcome = HookAnswer.REFUSED
        try:
            with container.get(RequestWatch).watching_without_refusal(["hook", program]):
                reply = self.prepared_answer(data, program, headers, database, container, started_at + sender.limit_seconds, sender)
            outcome = HookAnswer.REFUSED if reply.refusal else HookAnswer.ALLOWED
            return reply
        finally:
            database.set_busy_timeout(REQUEST_LOG_BUSY_SECONDS)
            self.context.request_trace.record_hook(lambda: container.get(HookRequestLog).record_hook(program, headers, data, (perf_counter() - started_at) * 1000, outcome, queued_ms, sender.session))

    def prepared_answer(self, data: object, program: str, headers: Mapping[str, str], database: Database, container: Container, deadline: float, sender: HookSender) -> HookReply:
        event = self.event(data, program, headers, container.get(Providers))
        tools = container.get(PerformanceTools)
        start_points = tools.begin()
        try:
            database.set_busy_timeout(LEAST_BUSY_SECONDS)
            HookDeliveryRetries(self.context.home).retry(container)
            database.set_busy_timeout(max(deadline - perf_counter(), LEAST_BUSY_SECONDS))
            route = container.get(HookRoute)
            self.timing.stamp("route_ready")
            return route.answer(event)
        except sqlite3.OperationalError as error:
            if DatabaseBusy.is_busy(error):
                return self.unchecked(sender, error)
            return self.failure(sender, error)
        except Exception as error:
            return self.failure(sender, error)
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

    def failure(self, sender: HookSender, error: Exception) -> HookReply:
        self.context.files.log_line("".join(traceback.format_exception(error)), LogLevel.ERROR)
        self.kept_row(sender, "")
        if sender.is_stop:
            return HookReply(refusal=f"the journal failed on this stop and holds it: {type(error).__name__}: {error}")
        if sender.needs_check:
            return HookReply(refusal=UNCHECKED_TOOL.format(reason=f"{type(error).__name__}: {error}"))
        return HookReply.allowed(f"the journal failed on this hook and let it through: {type(error).__name__}: {error}")

    def kept_row(self, sender: HookSender, program: str) -> None:
        line = " ".join(word for word in (program, sender.event_name) if word)
        RequestLog(self.context.home, FileAccess()).append(RequestLogEntry(None, None, ProcessType.HOOK, line, REFUSED_HOOK_EXIT_CODE, self.context.clock.timestamp().text, sender.session))

    @staticmethod
    def locked(sender: HookSender) -> HookReply:
        if sender.needs_check:
            return HookReply(refusal=SERVER_UPDATING)
        return HookReply.allowed(SERVER_UPDATING)

    def unchecked(self, sender: HookSender, reason: Exception) -> HookReply:
        self.kept_row(sender, "")
        if sender.is_stop:
            return HookReply(refusal=f"the journal could not check this stop and holds it: {reason}")
        if sender.needs_check:
            return HookReply(refusal=UNCHECKED_TOOL.format(reason=reason))
        return HookReply.allowed(f"the journal let this through unchecked: {reason}")

