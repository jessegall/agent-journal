from typing import TextIO

from core.base.caller.caller_request import CallerRequest
from core.base.cli.console import USAGE_CODE, Console
from core.base.cli.module_sync_line import SYNC_ARGV, ModuleSyncLine
from core.base.database.database import BUSY_TIMEOUT_SECONDS, Database
from core.base.journal_container import opened_container, synced_container
from core.base.journal_home import JournalHome
from core.base.registry.registry import StaleRegistryError


class LineRun:
    """Runs one journal command line for a caller on a journal's folder, as a direct run and the server both
    do: a module sync on an opened database, any other line on a synced one that waits for another writer up
    to its busy timeout, and the database closed after."""

    def __init__(self, home: JournalHome, busy_timeout_seconds: float = BUSY_TIMEOUT_SECONDS) -> None:
        self.home, self.busy_timeout_seconds = home, busy_timeout_seconds

    def run(self, argv: list[str], request: CallerRequest, stream: TextIO) -> int:
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
        container.get(Database).set_busy_timeout(self.busy_timeout_seconds)
        try:
            return container.get(Console).requested_run(argv, request, stream)
        finally:
            container.get(Database).close()
