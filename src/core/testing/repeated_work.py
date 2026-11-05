from collections import Counter
from collections.abc import Generator, Sequence
from contextlib import contextmanager
from contextvars import ContextVar
from functools import cache
import sqlite3
import sys
import traceback

from core.base.database.point_tally import TABLE_PATTERN, PointTally
from core.base.database.statement import Statement
from core.testing.repeated_calls_error import RepeatedCallsError

READ_LIMIT_REPEATS = 1
READ_TEXT_LIMIT_REPEATS = 10
COMMAND_LIMIT_REPEATS = 1
CALLER_FRAMES = 14
COMMAND_AUDIT_EVENT = "subprocess.Popen"
OPEN_REQUEST: ContextVar["RepeatedWork | None"] = ContextVar("open_request", default=None)
ALLOWED_READ_REPEATS = {
    ("core/base/database/kept_rows.py", "read"): "A write changes the database mark; cached rows must check their table signature again.",
    ("core/base/database/listener_cursor_table.py", "has_unhandled_events"): "Each listener round checks whether earlier listeners created more events.",
    ("core/base/database/listener_cursor_table.py", "has_pending_events"): "Startup completion must be checked as listener cursors advance.",
    ("core/base/change/event_log.py", "newest_id"): "Urgent listeners must notice events written by the previous listener.",
    ("core/base/change/event_log.py", "events_past"): "Listener rounds read new events written by earlier listeners.",
    ("core/testing/repeated_work.py", "reread"): "A cached selection reloads only after its table signature changes; unrelated writes keep the cached value.",
}
READ_HELPERS = ("core/base/database/database.py", "core/base/database/bookkeeping_table.py")


class RepeatedWork(PointTally):
    """Counts database work and rejects repeated reads and commands within each story request."""

    def __init__(self) -> None:
        super().__init__()
        self.reads: Counter[Statement] = Counter()
        self.read_texts: Counter[str] = Counter()
        self.commands: Counter[str] = Counter()
        self.findings: list[str] = []
        self.refreshed_tables: tuple[str, ...] = ()

    @contextmanager
    def request(self) -> Generator[None]:
        self.reads, self.read_texts, self.commands, self.findings = Counter(), Counter(), Counter(), []
        watch_commands()
        token = OPEN_REQUEST.set(self)
        try:
            yield
        finally:
            OPEN_REQUEST.reset(token)
        if self.findings:
            raise RepeatedCallsError("\n".join(self.findings))

    def loaded(self, rows: Sequence[sqlite3.Row], statement: Statement) -> None:
        super().loaded(rows, statement)
        if OPEN_REQUEST.get() is not self:
            return
        if not statement.is_read:
            return
        if self.is_refreshed(statement) or self.is_allowed_read():
            return
        self.reads[statement] += 1
        self.read_texts[statement.sql] += 1
        if self.reads[statement] == READ_LIMIT_REPEATS + 1:
            self.reject(f"one request read this more than {READ_LIMIT_REPEATS} times: {statement.sql} {statement.parameters}\n{self.caller_lines()}")
        if self.read_texts[statement.sql] == READ_TEXT_LIMIT_REPEATS + 1:
            self.reject(f"one request read this SQL more than {READ_TEXT_LIMIT_REPEATS} times: {statement.sql}\n{self.caller_lines()}")

    def reject(self, finding: str) -> None:
        self.findings.append(finding)
        raise RepeatedCallsError(finding)

    def is_refreshed(self, statement: Statement) -> bool:
        table = TABLE_PATTERN.search(statement.sql)
        return table is not None and table.group(1) in self.refreshed_tables

    @staticmethod
    def is_allowed_read() -> bool:
        frame = sys._getframe(2)
        while frame is not None:
            filename = frame.f_code.co_filename
            if not filename.endswith(READ_HELPERS):
                return any(filename.endswith(path) and frame.f_code.co_name == method for path, method in ALLOWED_READ_REPEATS)
            frame = frame.f_back
        return False

    @contextmanager
    def reread(self, table: str) -> Generator[None]:
        previous = self.refreshed_tables
        self.refreshed_tables = (*previous, table)
        try:
            yield
        finally:
            self.refreshed_tables = previous

    @staticmethod
    def caller_lines() -> str:
        return "".join(f"  {frame.filename}:{frame.lineno} {frame.name}\n" for frame in traceback.extract_stack(limit=CALLER_FRAMES))

    def note_command(self, command: str) -> None:
        self.commands[command] += 1
        if self.commands[command] == COMMAND_LIMIT_REPEATS + 1:
            self.reject(f"one request started this more than {COMMAND_LIMIT_REPEATS} times: {command}")


def audited(event: str, details: tuple[object, ...]) -> None:
    request = OPEN_REQUEST.get()
    if event == COMMAND_AUDIT_EVENT and request is not None:
        request.note_command(f"{details[1]} in {details[2]}")


@cache
def watch_commands() -> None:
    sys.addaudithook(audited)
