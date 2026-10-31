from typing import TextIO

from core.base.caller.caller_request import CallerRequest
from core.base.cli.console import USAGE_CODE, Console
from core.base.cli.module_sync_line import SYNC_ARGV, ModuleSyncLine
from core.base.database.database import BUSY_TIMEOUT_SECONDS, Database
from core.base.deadline import Deadline
from core.base.journal_container import opened_container, synced_container
from core.base.journal_home import JournalHome
from core.base.listener.commit_listener_runner import CommitListenerRunner
from core.base.registry.registry import StaleRegistryError
from core.base.trail import Trail


class LineRun:
    """Runs one journal command line for a caller on a journal's folder, as a direct run and the server both
    do: a module sync on an opened database, any other line on a synced one that waits for another writer up
    to its busy timeout, or the time left before the caller's deadline, and the database closed after. The
    server hands it the runner its commit listeners go to and the request's trail, stamped once the container
    is built; a direct run has no trail set, so it stamps nothing."""

    def __init__(self, home: JournalHome, busy_timeout_seconds: float = BUSY_TIMEOUT_SECONDS, listener_runner: CommitListenerRunner | None = None) -> None:
        self.home, self.busy_timeout_seconds, self.listener_runner = home, busy_timeout_seconds, listener_runner

    def run(self, argv: list[str], request: CallerRequest, stream: TextIO, deadline: Deadline | None = None,
            trail: Trail | None = None) -> int:
        if argv[:2] == SYNC_ARGV:
            container = opened_container(self.home)
            try:
                return container.get(ModuleSyncLine).run(argv, stream)
            finally:
                container.get(Database).close()
        try:
            container = synced_container(self.home)
        except StaleRegistryError as error:
            stream.write(f"{error}\n")
            return USAGE_CODE
        remaining_seconds = deadline.remaining_seconds() if deadline else None
        container.get(Database).set_busy_timeout(self.busy_timeout_seconds if remaining_seconds is None else remaining_seconds)
        if deadline is not None:
            container.bind(Deadline, deadline)
        if self.listener_runner is not None:
            container.bind(CommitListenerRunner, self.listener_runner)
        if trail is not None:
            container.bind(Trail, trail)
        container.get(Trail).stamp("command_started")
        try:
            return container.get(Console).requested_run(argv, request, stream)
        finally:
            container.get(Database).close()
