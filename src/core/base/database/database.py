import sqlite3
from contextlib import contextmanager

from core.base.database.nesting_error import NestingError
from core.base.database.statement import Statement
from core.base.journal_home import JournalHome

PRAGMAS = ("foreign_keys = ON", "journal_mode = WAL", "synchronous = NORMAL")
BUSY_TIMEOUT_SECONDS = 5.0
NESTING_LIMIT_LEVELS = 8


class Database:
    """The connection to the journal's database, with transactions that save everything or nothing."""

    def __init__(self, connection: sqlite3.Connection) -> None:
        self.connection = connection
        self.nested: list[str] = []

    @classmethod
    def opened(cls, home: JournalHome) -> "Database":
        home.database.parent.mkdir(parents=True, exist_ok=True)
        return cls.configured(sqlite3.connect(home.database, autocommit=True))

    @classmethod
    def shared(cls, home: JournalHome) -> "Database":
        home.database.parent.mkdir(parents=True, exist_ok=True)
        return cls.configured(sqlite3.connect(home.database, autocommit=True, check_same_thread=False))

    @classmethod
    def configured(cls, connection: sqlite3.Connection) -> "Database":
        connection.row_factory = sqlite3.Row
        for pragma in PRAGMAS:
            connection.execute(f"PRAGMA {pragma}")
        database = cls(connection)
        database.set_busy_timeout(BUSY_TIMEOUT_SECONDS)
        return database

    def set_busy_timeout(self, seconds: float) -> None:
        self.connection.execute(f"PRAGMA busy_timeout = {int(seconds * 1000)}")

    def busy_timeout_seconds(self) -> float:
        return int(self.connection.execute("PRAGMA busy_timeout").fetchone()[0]) / 1000

    @property
    def has_transaction(self) -> bool:
        return self.connection.in_transaction

    @contextmanager
    def transaction(self):
        self.connection.execute("BEGIN IMMEDIATE")
        try:
            yield
            self.connection.execute("COMMIT")
        except BaseException:
            if self.connection.in_transaction:
                self.connection.execute("ROLLBACK")
            raise

    @contextmanager
    def savepoint(self, label: str):
        if len(self.nested) >= NESTING_LIMIT_LEVELS:
            raise NestingError((*self.nested, label))
        name = f"nested_{len(self.nested)}"
        self.nested.append(label)
        self.connection.execute(f"SAVEPOINT {name}")
        try:
            yield
            self.connection.execute(f"RELEASE {name}")
        except BaseException:
            if self.connection.in_transaction:
                self.connection.execute(f"ROLLBACK TO {name}")
                self.connection.execute(f"RELEASE {name}")
            raise
        finally:
            self.nested.pop()

    def rows(self, statement: Statement) -> list[sqlite3.Row]:
        return statement.result(self.connection).fetchall()

    def insert(self, statement: Statement) -> int:
        row_id = statement.result(self.connection).lastrowid
        if row_id is None:
            raise sqlite3.InterfaceError(f"the insert gave no row id: {statement.sql}")
        return row_id

    def update(self, statement: Statement) -> int:
        return statement.result(self.connection).rowcount

    def close(self) -> None:
        self.connection.close()
