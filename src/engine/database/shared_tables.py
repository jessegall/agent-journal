from collections.abc import Callable
from functools import lru_cache
from pathlib import Path
import threading
from typing import TypeVar, cast

from engine.database.database import Database
from engine.database.kept_rows import Signature
from engine.database.kept_value import KeptValue
from engine.file.file_access import FileAccess
from engine.journal.journal_home import JournalHome

T = TypeVar("T")

UNSET_CHANGE_MARK = (-1, -1)
KEPT_HOMES = 512
WRITE_LOG_ENDING = "-wal"


class SharedTables:
    """Keeps a whole table between the containers of one journal home, behind the table's change signature,
    so a fresh container loads it only when it changed. A journal copied from a story template also shares
    the tables of that template with every other copy, but only while its database is as it was copied, with
    nothing in its write log: after its first write two copies may sign different rows alike, so each keeps
    its own. A table read inside a transaction is not kept."""

    def __init__(self, template: "SharedTables | None" = None, write_log: Path | None = None) -> None:
        self.lock = threading.Lock()
        self.tables: dict[str, KeptValue] = {}
        self.template, self.write_log = template, write_log

    @classmethod
    @lru_cache(maxsize=KEPT_HOMES)
    def shared(cls, home: JournalHome) -> "SharedTables":
        if home.template_database is None:
            return cls()
        return cls(cls.of_template(home.template_database), Path(f"{FileAccess.readlink(home.database)}{WRITE_LOG_ENDING}"))

    @classmethod
    @lru_cache(maxsize=KEPT_HOMES)
    def of_template(cls, template_database: Path) -> "SharedTables":
        return cls()

    def read(self, database: Database, table: str, signature: Signature, loader: Callable[[], T]) -> T:
        if self.template is not None and self.is_as_copied():
            return self.template.read(database, table, signature, loader)
        with self.lock:
            kept = self.tables.get(table)
        if kept is not None and kept.signature == signature:
            return cast(T, kept.value)
        loaded = loader()
        if not database.has_transaction:
            with self.lock:
                self.tables[table] = KeptValue(signature, UNSET_CHANGE_MARK, loaded)
        return loaded

    def is_as_copied(self) -> bool:
        return self.write_log is not None and (not FileAccess.exists(self.write_log) or FileAccess.stat(self.write_log).st_size == 0)
