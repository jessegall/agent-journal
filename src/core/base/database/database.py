import sqlite3
import sys
import threading
import time
import traceback
from contextlib import contextmanager

from core.base.database.nesting_error import NestingError
from core.base.database.point_tally import PointTally
from core.base.database.statement import Statement
from core.base.journal_home import JournalHome
from core.base.scope.row_owner import RowOwner

PRAGMAS = ("foreign_keys = ON", "journal_mode = WAL", "synchronous = NORMAL")
BUSY_TIMEOUT_SECONDS = 5.0
NESTING_LIMIT_LEVELS = 8
OPEN_WRITES: dict[int, float] = {}
WRITE_SAMPLER: list[threading.Thread] = []


def sample_open_writes() -> None:
    while True:
        time.sleep(0.5)
        frames = sys._current_frames()
        for thread_id, started in tuple(OPEN_WRITES.items()):
            if time.monotonic() - started > 1 and thread_id in frames:
                lines = [f"{frame.filename.rsplit('/', 2)[-1]}:{frame.lineno}" for frame in traceback.extract_stack(frames[thread_id]) if "/versions/" in frame.filename or "/src/" in frame.filename]
                print(f"SLOW SAMPLE {time.monotonic() - started:.1f}s {' '.join(lines[-9:])}", file=sys.stderr, flush=True)


class Database:
    """The connection to the journal's database, with transactions that save everything or nothing,
    and a tally of the points the work asks of it."""

    def __init__(self, connection: sqlite3.Connection, identity: str | sqlite3.Connection) -> None:
        self.connection = connection
        self.identity = identity
        self.nested: list[str] = []
        self.tally = PointTally()
        self.read_actor_id: int | None = None
        self.write_rollback_count = 0
        self.row_owner: RowOwner | None = None

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
        database_file = connection.execute("PRAGMA database_list").fetchone()[2]
        database = cls(connection, database_file or connection)
        database.set_busy_timeout(BUSY_TIMEOUT_SECONDS)
        return database

    def set_busy_timeout(self, seconds: float) -> None:
        self.connection.execute(f"PRAGMA busy_timeout = {int(seconds * 1000)}")

    def busy_timeout_seconds(self) -> float:
        return int(self.connection.execute("PRAGMA busy_timeout").fetchone()[0]) / 1000

    @property
    def has_transaction(self) -> bool:
        return self.connection.in_transaction

    def note_slow_write(self, started: float) -> None:
        held = time.monotonic() - started
        if held > 1:
            frames = [f"{frame.filename.rsplit('/', 3)[-1]}:{frame.lineno}" for frame in traceback.extract_stack() if "/modules/" in frame.filename or "/base/command/" in frame.filename]
            print(f"SLOW WRITE {held:.1f}s {' '.join(frames[-6:])}", file=sys.stderr, flush=True)

    @contextmanager
    def transaction(self):
        changes = self.connection.total_changes
        self.connection.execute("BEGIN IMMEDIATE")
        started = time.monotonic()
        if not WRITE_SAMPLER:
            WRITE_SAMPLER.append(threading.Thread(target=sample_open_writes, daemon=True))
            WRITE_SAMPLER[0].start()
        OPEN_WRITES[threading.get_ident()] = started
        try:
            yield
            self.connection.execute("COMMIT")
            self.note_slow_write(started)
        except BaseException:
            self.record_rollback(changes)
            if self.connection.in_transaction:
                self.connection.execute("ROLLBACK")
            raise
        finally:
            OPEN_WRITES.pop(threading.get_ident(), None)

    @contextmanager
    def savepoint(self, label: str):
        if len(self.nested) >= NESTING_LIMIT_LEVELS:
            raise NestingError((*self.nested, label))
        name = f"nested_{len(self.nested)}"
        self.nested.append(label)
        changes = self.connection.total_changes
        self.connection.execute(f"SAVEPOINT {name}")
        try:
            yield
            self.connection.execute(f"RELEASE {name}")
        except BaseException:
            self.record_rollback(changes)
            if self.connection.in_transaction:
                self.connection.execute(f"ROLLBACK TO {name}")
                self.connection.execute(f"RELEASE {name}")
            raise
        finally:
            self.nested.pop()

    def change_mark(self) -> tuple[int, int]:
        return self.connection.execute("PRAGMA data_version").fetchone()[0], self.connection.total_changes

    def record_rollback(self, changes: int) -> None:
        if changes != self.connection.total_changes:
            self.write_rollback_count += 1

    def rows(self, statement: Statement) -> list[sqlite3.Row]:
        if not statement.is_read:
            self.tally.count_write(statement.sql)
        rows = statement.result(self.connection).fetchall()
        self.tally.loaded(rows, statement)
        return rows

    def query_plan(self, statement: Statement) -> tuple[str, ...]:
        return tuple(row[3] for row in self.connection.execute(f"EXPLAIN QUERY PLAN {statement.sql}", statement.parameters))

    def is_partial_index(self, name: str) -> bool:
        row = self.connection.execute("SELECT partial FROM pragma_index_list((SELECT tbl_name FROM sqlite_master WHERE type = 'index' AND name = ?)) WHERE name = ?", (name, name)).fetchone()
        return row is not None and bool(row[0])

    def insert(self, statement: Statement) -> int:
        self.tally.count_write(statement.sql)
        row_id = statement.result(self.connection).lastrowid
        if row_id is None:
            raise sqlite3.InterfaceError(f"the insert gave no row id: {statement.sql}")
        return row_id

    def update(self, statement: Statement) -> int:
        self.tally.count_write(statement.sql)
        return statement.result(self.connection).rowcount

    def close(self) -> None:
        self.connection.close()
