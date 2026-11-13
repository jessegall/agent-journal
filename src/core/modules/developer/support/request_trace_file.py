import json
import sqlite3
from collections.abc import Sequence

from engine.database.database import Database
from engine.database.hook_requests_table import HookRequestsTable
from engine.file.append_log import AppendLog
from engine.file.file_access import FileAccess
from engine.journal.journal_home import JournalHome
from core.modules.developer.support.trace_receipt import TraceReceipt
from core.modules.developer.support.trace_row import TraceRow

TRACE_FILE_NAME = "request-trace.log"
CLAIMED_TRACE_FILE_NAME = "request-trace.taken"
BUSY_CODES = (sqlite3.SQLITE_BUSY, sqlite3.SQLITE_LOCKED)


class RequestTraceFile:
    """The file the server appends the developer trace's rows and read receipts to, so answering a request
    never waits for the database. A tick moves the file aside and, on its next round, writes what the moved
    file holds to the table in one transaction and in the order it came; a busy database keeps the moved file
    for the round after, so no row is lost. A line that is not an entry is left out."""

    def __init__(self, home: JournalHome, files: FileAccess) -> None:
        self.home, self.files = home, files

    @property
    def lines(self) -> AppendLog:
        return AppendLog(self.home.folder / TRACE_FILE_NAME, self.home.folder / CLAIMED_TRACE_FILE_NAME, self.files)

    def append(self, entries: Sequence[TraceRow | TraceReceipt]) -> None:
        with self.files.writer(self.lines.path, "a") as trace:
            trace.write("".join(entry.text() + "\n" for entry in entries))

    def import_rows(self, database: Database, table: HookRequestsTable, size: int) -> None:
        entries = tuple(entry for entry in (self.entry(line) for line in self.lines.claimed_lines()) if entry is not None)
        if entries:
            try:
                with database.transaction():
                    for entry in entries:
                        entry.write(table)
                    table.trim(size)
            except sqlite3.OperationalError as failure:
                if failure.sqlite_errorcode not in BUSY_CODES:
                    raise
                return
        self.lines.archive()

    @staticmethod
    def entry(line: str) -> TraceRow | TraceReceipt | None:
        try:
            fields = json.loads(line)
            return TraceRow(fields["row"]) if "row" in fields else TraceReceipt(**fields["receipt"])
        except (json.JSONDecodeError, KeyError, TypeError):
            return None
