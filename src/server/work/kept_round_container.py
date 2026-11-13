from engine.file.file_access import FileAccess
import os
import sqlite3

from engine.container.container import Container
from engine.container.round_states import RoundStates
from engine.database.database import Database
from engine.database.registry_table import RegistryTable
from engine.database.registry_version import RegistryVersion
from engine.database.write_turns import WriteTurns
from engine.enums.log_level import LogLevel
from engine.journal.journal_home import JournalHome
from engine.log.system_log_writer import SystemLogWriter
from engine.module.journal_container import synced_database_container
from engine.time.clock import Clock
from server.work.round_container import RoundContainer

BACKGROUND_BUSY_TIMEOUT_SECONDS = 60.0
PRIMARY_ERROR_CODE_MASK = 0xFF
BUSY_ERROR_CODES = frozenset({sqlite3.SQLITE_BUSY, sqlite3.SQLITE_LOCKED})


def background_container(home: JournalHome, turns: WriteTurns | None = None) -> Container:
    database = Database.opened(home, turns)
    database.set_busy_timeout(BACKGROUND_BUSY_TIMEOUT_SECONDS)
    try:
        return synced_database_container(home, database)
    except BaseException:
        database.close()
        raise


class KeptRoundContainer(RoundContainer):
    """The container one background thread keeps for its life: one connection, one registry, one set of
    services. Each round resets the RoundState services; a new registry, a replaced database file or a
    broken connection builds it once more."""

    def __init__(self, home: JournalHome, turns: WriteTurns | None = None) -> None:
        self.home = home
        self.turns = turns
        self.container: Container | None = None
        self.registry_version: RegistryVersion | None = None
        self.database_file: os.stat_result | None = None

    def round_container(self) -> Container:
        if self.container is not None and self.database_file_replaced():
            self.close_with_reason("database file replaced")
        container = self.rebuilt() if self.container is None or self.registry_changed() else self.container
        for service in container.get(RoundStates).services():
            service.reset()
        return container

    def rebuilt(self) -> Container:
        self.close()
        self.container = background_container(self.home, self.turns)
        database = self.container.get(Database)
        self.registry_version = RegistryTable(database).version()
        self.database_file = FileAccess.stat(self.home.database)
        return self.container

    def registry_changed(self) -> bool:
        return self.container is not None and RegistryTable(self.container.get(Database)).version() != self.registry_version

    def database_file_replaced(self) -> bool:
        current = FileAccess.stat(self.home.database)
        return self.database_file is None or (current.st_dev, current.st_ino) != (self.database_file.st_dev, self.database_file.st_ino)

    def ended_round(self, work_name: str) -> None:
        if self.container is None:
            return
        database = self.container.get(Database)
        if not database.has_transaction:
            return
        database.rollback()
        self.log(f"kept container rolled back a transaction the round {work_name} left open")

    def failed(self, error: BaseException, work_name: str) -> None:
        if not isinstance(error, sqlite3.DatabaseError) or is_busy_error(error):
            return
        self.close_with_reason(f"{work_name}: {error}")

    def close_with_reason(self, reason: str) -> None:
        self.close()
        self.log(f"kept container rebuilt: {reason}")

    def log(self, text: str) -> None:
        SystemLogWriter(self.home, Clock()).write(LogLevel.WARNING, text)

    def close(self) -> None:
        if self.container is None:
            return
        self.container.get(Database).close()
        self.container = None


def is_busy_error(error: sqlite3.DatabaseError) -> bool:
    return isinstance(error, sqlite3.OperationalError) and error.sqlite_errorcode & PRIMARY_ERROR_CODE_MASK in BUSY_ERROR_CODES
