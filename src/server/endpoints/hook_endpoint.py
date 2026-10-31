import sqlite3
import traceback
from collections.abc import Mapping

from core.base.database.database import Database
from core.base.driver.hook_event import HookEvent
from core.base.driver.hook_reply import HookReply
from core.base.driver.hook_route import HookRoute
from core.base.provider.providers import Providers
from core.base.journal_container import synced_database_container
from core.base.registry.stale_registry_error import StaleRegistryError
from core.base.timing import Timing
from server.hook.raw_hook_body import RawHookBody, is_raw_body
from server.hook.hook_headers import HookHeaders
from server.hook.hook_database_busy_error import HookDatabaseBusyError
from server.server_context import ServerContext



class HookEndpoint:
    """Answers POST /hook: reads a hook's object, prepared or raw, and runs it through the hook route on a
    synced journal over the connection the server's hooks share, waiting for another writer up to the hook
    limit. A stale registry, a wait past the limit or a fault outside the rules lets the hook through with one
    line; a fault goes to the server log."""

    def __init__(self, timing: Timing, context: ServerContext) -> None:
        self.timing, self.context = timing, context

    def answer(self, data: object, program: str, headers: Mapping[str, str]) -> HookReply:
        try:
            with self.context.hook_database.used(self.context.hook_limit_seconds) as database:
                self.timing.stamp("hook_locked")
                return self.routed_answer(data, program, headers, database)
        except HookDatabaseBusyError as error:
            return HookReply.allowed(f"the journal let this through unchecked: {error}")
        finally:
            self.timing.stamp("hook_answered")
            self.context.listener_thread.wake()

    def routed_answer(self, data: object, program: str, headers: Mapping[str, str], database: Database) -> HookReply:
        try:
            container = synced_database_container(self.context.home, database)
        except StaleRegistryError as error:
            return HookReply.allowed(f"the journal let this through unchecked: {error}")
        container.bind(Timing, self.timing)
        self.timing.stamp("hook_synced")
        event = self.event(data, program, headers, container.get(Providers))
        database.set_busy_timeout(self.context.hook_limit_seconds)
        try:
            route = container.get(HookRoute)
            self.timing.stamp("route_ready")
            return route.answer(event)
        except sqlite3.OperationalError as error:
            if error.sqlite_errorcode == sqlite3.SQLITE_BUSY:
                return HookReply.allowed(f"the journal let this through unchecked: {error}")
            return self.failure(error)
        except Exception as error:
            return self.failure(error)

    def event(self, data: object, program: str, headers: Mapping[str, str], providers: Providers) -> HookEvent:
        if is_raw_body(data):
            event = RawHookBody.parsed(data).event(program, providers.provider(program).hook_events, HookHeaders.parsed(headers))
        else:
            event = HookEvent.parsed(data)
            providers.provider(event.program)
        self.timing.stamp("hook_read")
        return event

    def failure(self, error: Exception) -> HookReply:
        self.context.files.log_line("".join(traceback.format_exception(error)))
        return HookReply.allowed(f"the journal failed on this hook and let it through: {type(error).__name__}: {error}")

