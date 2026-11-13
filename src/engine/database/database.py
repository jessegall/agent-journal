import sqlite3
from pathlib import Path
from contextlib import contextmanager
from pathlib import Path
from typing import TYPE_CHECKING

from engine.database.errors.nesting_error import NestingError
from engine.database.point_tally import PointTally
from engine.database.statement import Statement
from engine.errors.read_cut_error import ReadCutError
from engine.errors.read_limit_error import ReadLimitError
from engine.journal.journal_home import JournalHome
from engine.row.row_owner import RowOwner

if TYPE_CHECKING:
    from engine.database.kept_rows import KeptRows

PRAGMAS = ("auto_vacuum = INCREMENTAL", "foreign_keys = ON", "journal_mode = WAL", "synchronous = NORMAL")
BUSY_TIMEOUT_SECONDS = 5.0
READ_LIMIT_ROWS = 50
NESTING_LIMIT_LEVELS = 8
AUTO_VACUUM_OFF = 0


class Database:
    """The connection to the journal's database, with transactions that save everything or nothing,
    and a tally of the points the work asks of it."""

    def __init__(self, connection: sqlite3.Connection, identity: str | sqlite3.Connection) -> None:
        self.connection = connection
        self.identity = identity
        self.nested: list[str] = []
        self.repeated_work = PointTally()
        self.read_actor_id: int | None = None
        self.write_rollback_count = 0
        self.row_owner: RowOwner | None = None
        self.kept_rows: "KeptRows | None" = None
        self.read_limit_rows: int | None = None
        self.collected_large_reads: list[ReadLimitError | ReadCutError] | None = None
        self.read_cuts: list[ReadCutError] = []
        self.cuts_raise = False

    @property
    def scope_environment_id(self) -> int | None:
        return self.row_owner.environment_id if self.row_owner is not None else None

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

    def file(self) -> Path:
        return Path(self.connection.execute("PRAGMA database_list").fetchone()[2])

    def backup_to(self, target: Path) -> None:
        source = sqlite3.connect(f"{self.file().as_uri()}?mode=ro", uri=True)
        copy = sqlite3.connect(target)
        try:
            source.backup(copy)
        finally:
            copy.close()
            source.close()

    def turn_on_auto_vacuum(self) -> bool:
        """Turns on incremental auto vacuum for a database made before it, which SQLite applies only with one full
        VACUUM, and says whether it did; a database that has it already is left alone."""
        if self.connection.execute("PRAGMA auto_vacuum").fetchone()[0] != AUTO_VACUUM_OFF:
            return False
        self.connection.execute("PRAGMA auto_vacuum = INCREMENTAL")
        self.connection.execute("VACUUM")
        return True

    def release_free_pages(self, pages: int) -> None:
        self.connection.execute(f"PRAGMA incremental_vacuum({int(pages)})").fetchall()

    def set_busy_timeout(self, seconds: float) -> None:
        self.connection.execute(f"PRAGMA busy_timeout = {int(seconds * 1000)}")

    def busy_timeout_seconds(self) -> float:
        return int(self.connection.execute("PRAGMA busy_timeout").fetchone()[0]) / 1000

    @property
    def has_transaction(self) -> bool:
        return self.connection.in_transaction

    @contextmanager
    def transaction(self):
        changes = self.connection.total_changes
        self.connection.execute("BEGIN IMMEDIATE")
        try:
            yield
            self.connection.execute("COMMIT")
        except BaseException:
            self.record_rollback(changes)
            if self.connection.in_transaction:
                self.connection.execute("ROLLBACK")
            raise

    @contextmanager
    def consistent_read(self):
        if self.has_transaction:
            yield
            return
        self.connection.execute("BEGIN")
        try:
            yield
        finally:
            if self.connection.in_transaction:
                self.connection.execute("COMMIT")

    @contextmanager
    def savepoint(self, label: str):
        if len(self.nested) >= NESTING_LIMIT_LEVELS:
            raise NestingError((*self.nested, label))
        name = f"nested_{len(self.nested)}"
        locked = self.has_transaction
        self.nested.append(label)
        changes = self.connection.total_changes
        if locked:
            self.connection.execute(f"SAVEPOINT {name}")
        try:
            yield
            if locked:
                self.connection.execute(f"RELEASE {name}")
        except BaseException:
            self.record_rollback(changes)
            if locked and self.connection.in_transaction:
                self.connection.execute(f"ROLLBACK TO {name}")
                self.connection.execute(f"RELEASE {name}")
            raise
        finally:
            self.nested.pop()

    def change_mark(self) -> tuple[int, int]:
        return self.connection.execute("PRAGMA data_version").fetchone()[0], self.connection.total_changes

    def content_mark(self) -> tuple[int, int, int]:
        return *self.change_mark(), self.write_rollback_count

    def record_rollback(self, changes: int) -> None:
        if changes != self.connection.total_changes:
            self.write_rollback_count += 1

    def rows(self, statement: Statement) -> list[sqlite3.Row]:
        if statement.is_read:
            self.repeated_work.mark_read()
        else:
            self.repeated_work.count_write(statement.sql)
        rows = statement.result(self.connection).fetchall()
        self.check_read_limit(statement, len(rows))
        self.repeated_work.loaded(rows, statement)
        return rows

    def check_read_limit(self, statement: Statement, count: int) -> None:
        if self.read_limit_rows is None or not statement.is_limited_read:
            return
        named = statement.named_limit_rows
        allowed = self.read_limit_rows if named is None else max(self.read_limit_rows, named)
        if count <= allowed:
            return
        error = ReadLimitError.loaded(count, allowed, statement.sql)
        if self.collected_large_reads is None:
            raise error
        self.collected_large_reads.append(error)

    def report_cut(self, sql: str, limit: int) -> None:
        """Keeps a report of a read the query builder cut at its limit, once per statement and calling line, with
        the developer read limit on or off; a cut fails only where cuts raise, as under the story kit."""
        report = ReadCutError.cut(limit, sql)
        if self.cuts_raise:
            raise report
        for reports in (self.read_cuts, self.collected_large_reads):
            if reports is not None and all(str(known) != str(report) for known in reports):
                reports.append(report)

    def query_plan(self, statement: Statement) -> tuple[str, ...]:
        return tuple(row[3] for row in self.connection.execute(f"EXPLAIN QUERY PLAN {statement.sql}", statement.parameters))

    def is_partial_index(self, name: str) -> bool:
        row = self.connection.execute("SELECT partial FROM pragma_index_list((SELECT tbl_name FROM sqlite_master WHERE type = 'index' AND name = ?)) WHERE name = ?", (name, name)).fetchone()
        return row is not None and bool(row[0])

    def defer_checkpoints(self) -> None:
        """Keeps the writes of this connection in its write-ahead log, also when it closes, so the file stays as it was
        until the log is taken in or thrown away."""
        self.connection.execute("PRAGMA wal_autocheckpoint = 0")
        self.connection.setconfig(sqlite3.SQLITE_DBCONFIG_NO_CKPT_ON_CLOSE, True)

    @staticmethod
    def file_integrity(path: Path) -> str:
        """What sqlite's integrity check says of a database file opened only to read it: 'ok', or what is wrong."""
        connection = sqlite3.connect(f"{path.resolve().as_uri()}?mode=ro", uri=True)
        try:
            return str(connection.execute("PRAGMA integrity_check").fetchone()[0])
        except sqlite3.DatabaseError as error:
            return str(error)
        finally:
            connection.close()

    def row_state(self, table: str, row_id: int) -> str | None:
        """The state of one row by its key, or None when the table has no such row."""
        rows = self.rows(Statement(f"SELECT state FROM {table} WHERE id = ?", [row_id]))
        return rows[0]["state"] if rows else None

    def insert(self, statement: Statement) -> int:
        self.repeated_work.count_write(statement.sql)
        row_id = statement.result(self.connection).lastrowid
        if row_id is None:
            raise sqlite3.InterfaceError(f"the insert gave no row id: {statement.sql}")
        return row_id

    def update(self, statement: Statement) -> int:
        self.repeated_work.count_write(statement.sql)
        return statement.result(self.connection).rowcount

    def close(self) -> None:
        self.connection.close()
