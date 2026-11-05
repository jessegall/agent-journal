from collections import Counter
from collections.abc import Generator, Sequence
from contextlib import contextmanager
from contextvars import ContextVar
from functools import cache
import sqlite3
import sys
import traceback

from core.base.database.point_tally import PointTally
from core.base.database.statement import Statement
from core.testing.repeated_calls_error import RepeatedCallsError

READ_LIMIT_REPEATS = 5
READ_TEXT_LIMIT_REPEATS = 10
COMMAND_LIMIT_REPEATS = 3
CALLER_FRAMES = 14
COMMAND_AUDIT_EVENT = "subprocess.Popen"
OPEN_REQUEST: ContextVar["RepeatedWork | None"] = ContextVar("open_request", default=None)
ALLOWED_READ_REPEATS = {
    ("core/base/database/kept_rows.py", "read"): "A write changes the database mark; cached rows must check their table signature again.",
    ("core/base/database/listener_cursor_table.py", "has_unhandled_events"): "Each listener round checks whether earlier listeners created more events.",
    ("core/base/database/listener_cursor_table.py", "has_pending_events"): "Startup completion must be checked as listener cursors advance.",
    ("core/base/change/event_log.py", "newest_id"): "Urgent listeners must notice events written by the previous listener.",
    ("core/base/change/event_log.py", "events_past"): "Listener rounds read new events written by earlier listeners.",
}
READ_HELPERS = ("core/base/database/database.py", "core/base/database/bookkeeping_table.py")


class RepeatedWork(PointTally):
    """Counts database work and rejects repeated reads and commands within each story request."""

    def __init__(self, read_text_limit: int | None = None) -> None:
        super().__init__()
        self.read_text_limit = read_text_limit
        self.reads: Counter[Statement] = Counter()
        self.read_texts: Counter[str] = Counter()
        self.commands: Counter[str] = Counter()
        self.findings: list[str] = []

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
        if self.is_allowed_read():
            return
        self.reads[statement] += 1
        self.read_texts[statement.sql] += 1
        if self.reads[statement] == READ_LIMIT_REPEATS + 1:
            self.reject(f"one request read this more than {READ_LIMIT_REPEATS} times without a write: {statement.sql} {statement.parameters}\n{self.caller_lines()}")
        if self.read_text_limit is not None and self.read_texts[statement.sql] == self.read_text_limit + 1:
            self.reject(f"one request read this SQL more than {self.read_text_limit} times without a write: {statement.sql}\n{self.caller_lines()}")

    def count_write(self, sql: str) -> None:
        super().count_write(sql)
        self.reads.clear()
        self.read_texts.clear()

    def reject(self, finding: str) -> None:
        self.findings.append(finding)
        raise RepeatedCallsError(finding)

    @staticmethod
    def is_allowed_read() -> bool:
        frame = sys._getframe(2)
        while frame is not None:
            filename = frame.f_code.co_filename
            if not filename.endswith(READ_HELPERS):
                return any(filename.endswith(path) and frame.f_code.co_name == method for path, method in ALLOWED_READ_REPEATS)
            frame = frame.f_back
        return False

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
