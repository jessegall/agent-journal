import sqlite3
import traceback
from collections.abc import Mapping

from core.base.database.database import Database
from core.base.driver.hook_event import HookEvent
from core.base.driver.hook_event_error import HookEventError
from core.base.driver.hook_reply import HookReply
from core.base.driver.hook_route import HookRoute
from core.base.journal_container import synced_database_container
from core.base.registry.stale_registry_error import StaleRegistryError
from core.base.timing import Timing
from server.hook.raw_hook_body import HookHeaders, RawHookBody, is_raw_body
from server.journal_server import ServerContext

HOOK_LIMIT_SECONDS = 3.0
PROGRAMS = ("claude", "codex")


class HookEndpoint:
    """Answers POST /hook: reads a hook's object, prepared or raw, and runs it through the hook route on a
    synced journal over the connection the server's hooks share, waiting for another writer up to the hook
    limit. A stale registry, a wait past the limit or a fault outside the rules lets the hook through with one
    line; a fault goes to the server log."""

    def __init__(self, timing: Timing, context: ServerContext) -> None:
        self.timing, self.context = timing, context

    def event(self, data: object, program: str, headers: Mapping[str, str]) -> HookEvent:
        event = RawHookBody.parsed(data).event(program, HookHeaders.parsed(headers)) if is_raw_body(data) else HookEvent.parsed(data)
        self.timing.stamp("hook_read")
        return event

    def answer(self, event: HookEvent) -> HookReply:
        if event.program not in PROGRAMS:
            raise HookEventError(f"no agent program is named {event.program!r}")
        with self.context.hook_database.used() as database:
            try:
                return self.routed_answer(event, database)
            finally:
                self.timing.stamp("hook_answered")
                self.context.listener_thread.wake()

    def routed_answer(self, event: HookEvent, database: Database) -> HookReply:
        try:
            container = synced_database_container(self.context.home, database)
        except StaleRegistryError as error:
            return HookReply.allowed(f"the journal let this through unchecked: {error}")
        database.set_busy_timeout(HOOK_LIMIT_SECONDS)
        try:
            return container.get(HookRoute).answer(event)
        except sqlite3.OperationalError as error:
            if error.sqlite_errorcode == sqlite3.SQLITE_BUSY:
                return HookReply.allowed(f"the journal let this through unchecked: {error}")
            return self.failure(error)
        except Exception as error:
            return self.failure(error)

    def failure(self, error: Exception) -> HookReply:
        self.context.files.log_line("".join(traceback.format_exception(error)))
        return HookReply.allowed(f"the journal failed on this hook and let it through: {type(error).__name__}: {error}")

