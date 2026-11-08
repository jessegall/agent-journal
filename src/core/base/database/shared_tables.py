from collections.abc import Callable
from functools import cache
import threading
from typing import TypeVar, cast

from core.base.database.database import Database
from core.base.database.kept_rows import Signature
from core.base.database.kept_value import KeptValue
from core.base.journal_home import JournalHome

T = TypeVar("T")

UNSET_CHANGE_MARK = (-1, -1)


class SharedTables:
    """Keeps a whole table between the containers of one journal home, behind the table's change signature,
    so a fresh container loads it only when it changed. A table read inside a transaction is not kept."""

    def __init__(self) -> None:
        self.lock = threading.Lock()
        self.tables: dict[str, KeptValue] = {}

    @classmethod
    @cache
    def shared(cls, home: JournalHome) -> "SharedTables":
        return cls()

    def read(self, database: Database, table: str, signature: Signature, loader: Callable[[], T]) -> T:
        with self.lock:
            kept = self.tables.get(table)
        if kept is not None and kept.signature == signature:
            return cast(T, kept.value)
        loaded = loader()
        if not database.has_transaction:
            with self.lock:
                self.tables[table] = KeptValue(signature, UNSET_CHANGE_MARK, loaded)
        return loaded
