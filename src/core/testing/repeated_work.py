from collections import Counter
from collections.abc import Generator, Sequence
from contextlib import contextmanager
from contextvars import ContextVar
from functools import cache
import sqlite3
import re
import sys
from types import FrameType
import traceback

from core.base.database.point_tally import PointTally
from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.file_access import FILE_READ_EVENT, FILE_CHANGE_EVENT
from core.testing.repeated_calls_error import RepeatedCallsError

READ_LIMIT_REPEATS = 1
READ_TEXT_LIMIT_REPEATS = 10
COMMAND_LIMIT_REPEATS = 3
CALLER_FRAMES = 14
COMMAND_AUDIT_EVENT = "subprocess.Popen"
OPEN_REQUEST: ContextVar["RepeatedWork | None"] = ContextVar("open_request", default=None)
SCAN_TABLE = re.compile(r"\bSCAN(?: TABLE)? (\w+)")
SCAN_INDEX = re.compile(r"\bUSING INDEX (\w+)")
BOUNDED_PAGE = re.compile(r"^SELECT \* FROM (\w+)(?: ORDER BY id (?:ASC|DESC))? LIMIT ([1-9]\d*|\?) OFFSET (\d+|\?)$", re.IGNORECASE)
UNFILTERED_COUNT = re.compile(r"^SELECT count\(\*\) FROM \w+$", re.IGNORECASE)
SMALL_TABLES = {
    "settings": "Project and environment settings are small configuration sets kept on the connection.",
    "secret_settings": "Secret settings are a small configuration set kept on the connection.",
    "sequences": "Reusable instructions form a small catalogue indexed in memory after one read.",
    "templates": "Task and document templates form a small catalogue read together.",
    "readers": "Output readers are a small configuration catalogue read together.",
    "aliases": "Saved commands are a small configuration catalogue read together.",
    "environments": "A project has a small set of environments listed together.",
    "registry": "The registry has one row.",
    "rules": "Standing project instructions are a small set delivered together.",
    "listener_cursors": "One cursor per declared listener is read together at the start of a listener round.",
    "mcp_servers": "Configured MCP endpoints form a small catalogue loaded together.",
    "plugins": "Installed plugins form a small configuration catalogue, not event history.",
    "releases": "Available releases form a small upstream catalogue, not event history.",
    "statistics": "One row per named statistic, listed together.",
    "hook_requests": "The developer's request log keeps only its newest requests.",
    "secrets": "A project's secrets form a small catalogue.",
    "docs": "The document library is read and counted as one small list.",
    "reports": "The report library is read and counted as one small list.",
}
ALLOWED_READ_REPEATS = {
    ("core/base/database/kept_rows.py", "kept_value"): "A write changes the database mark; cached rows must check their table signature again.",
    ("core/base/database/listener_cursor_table.py", "has_unhandled_events"): "Each listener round checks whether earlier listeners created more events.",
    ("core/base/database/listener_cursor_table.py", "has_pending_events"): "Startup completion must be checked as listener cursors advance.",
    ("core/base/change/event_log.py", "newest_id"): "Urgent listeners must notice events written by the previous listener.",
    ("core/base/change/event_log.py", "events_past"): "Listener rounds read new events written by earlier listeners.",
}
BULK_SEEDS = "core/base/seed/demo.py"
READ_HELPERS = ("core/base/database/database.py", "core/base/database/bookkeeping_table.py", "unittest/mock.py", "<string>")
ALLOWED_FILE_READS = {
    "core/modules/plugins/support/plugin_code_diff.py": "An upgrade preview compares every file of a plugin, its manifest among them.",
}


class RepeatedWork(PointTally):
    """Counts database work and rejects repeated reads and commands within each story request."""

    def __init__(self, database: Database | None = None, read_text_limit: int = READ_TEXT_LIMIT_REPEATS) -> None:
        super().__init__()
        self.database = database
        self.read_text_limit = read_text_limit
        self.reads: Counter[Statement] = Counter()
        self.read_origins: dict[Statement, str] = {}
        self.read_texts: Counter[str] = Counter()
        self.commands: Counter[str] = Counter()
        self.findings: list[str] = []
        self.checked_plans: set[Statement] = set()
        self.allowed_scans: dict[Statement, str] = {}
        self.file_reads: Counter[str] = Counter()
        self.read_mark: tuple[int, int] | None = None

    @contextmanager
    def request(self) -> Generator[None]:
        self.reads, self.read_texts, self.commands, self.findings = Counter(), Counter(), Counter(), []
        self.read_origins.clear()
        self.checked_plans.clear()
        self.allowed_scans.clear()
        self.file_reads.clear()
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
        if self.database is not None:
            self.check_scan(statement)
        if self.is_allowed_read():
            return
        self.clear_reads_on_change()
        self.reads[statement] += 1
        self.read_texts[statement.sql] += 1
        if self.reads[statement] == 1:
            self.read_origins[statement] = self.caller_lines()
        if self.reads[statement] == READ_LIMIT_REPEATS + 1:
            self.reject(f"one request read this more than {READ_LIMIT_REPEATS} times: {statement.sql} {statement.parameters}\nfirst read:\n{self.read_origins[statement]}repeated read:\n{self.caller_lines()}")
        if self.read_texts[statement.sql] == self.read_text_limit + 1:
            self.reject(f"one request read this SQL more than {self.read_text_limit} times: {statement.sql}\n{self.caller_lines()}")

    def clear_reads_on_change(self) -> None:
        change_mark = self.database.change_mark() if self.database is not None else None
        if change_mark != self.read_mark:
            self.reads, self.read_mark = Counter(), change_mark
            self.read_origins.clear()

    def reject(self, finding: str) -> None:
        self.findings.append(finding)
        raise RepeatedCallsError(finding)

    @staticmethod
    def is_allowed_read() -> bool:
        frame = sys._getframe(2)
        while frame is not None and frame.f_code.co_filename.endswith(READ_HELPERS):
            frame = frame.f_back
        if frame is None:
            return False
        is_allowed = any(frame.f_code.co_filename.endswith(path) and frame.f_code.co_name == method for path, method in ALLOWED_READ_REPEATS)
        return is_allowed or RepeatedWork.is_bulk_seed(frame)

    @staticmethod
    def is_bulk_seed(frame: FrameType | None) -> bool:
        while frame is not None:
            if frame.f_code.co_filename.endswith(BULK_SEEDS):
                return True
            frame = frame.f_back
        return False

    def check_scan(self, statement: Statement) -> None:
        if statement in self.checked_plans:
            return
        self.checked_plans.add(statement)
        if UNFILTERED_COUNT.fullmatch(statement.sql):
            return
        page = BOUNDED_PAGE.fullmatch(statement.sql)
        plans = self.database.query_plan(statement)
        for plan in plans:
            if "USING COVERING INDEX" in plan or plan == "SCAN CONSTANT ROW":
                continue
            match = SCAN_TABLE.search(plan)
            if match is None or match.group(1) in SMALL_TABLES:
                continue
            if self.is_logical_scan(match.group(1), plans):
                continue
            if page is not None and not any("TEMP B-TREE" in step for step in plans) and self.has_page_bounds(page, statement):
                continue
            index = SCAN_INDEX.search(plan)
            if index is not None and self.database.is_partial_index(index.group(1)):
                continue
            if statement.scan_reason is not None:
                self.allowed_scans[statement] = statement.scan_reason
                continue
            self.findings.append(f"one request scanned {match.group(1)}: {plan}\n{statement.sql} {statement.parameters}\n{self.caller_lines()}")

    @staticmethod
    def has_page_bounds(page: re.Match[str], statement: Statement) -> bool:
        parameters = iter(statement.parameters)
        limit, offset = (next(parameters) if value == "?" else int(value) for value in page.groups()[1:])
        return isinstance(limit, int) and limit > 0 and isinstance(offset, int) and offset >= 0

    @staticmethod
    def is_logical_scan(table: str, plans: Sequence[str]) -> bool:
        if any(plan.startswith(f"SCAN {table} VIRTUAL TABLE INDEX") for plan in plans):
            return True
        return any(plan in (f"CO-ROUTINE {table}", f"MATERIALIZE {table}") for plan in plans)

    @staticmethod
    def caller_lines() -> str:
        return "".join(f"  {frame.filename}:{frame.lineno} {frame.name}\n" for frame in traceback.extract_stack(limit=CALLER_FRAMES))

    def note_command(self, command: str) -> None:
        self.commands[command] += 1
        if self.commands[command] == COMMAND_LIMIT_REPEATS + 1:
            self.reject(f"one request started this more than {COMMAND_LIMIT_REPEATS} times: {command}")

    def note_file_read(self, path: str) -> None:
        if self.is_allowed_file_read():
            return
        self.file_reads[path] += 1
        if self.file_reads[path] == 2:
            self.findings.append(f"one request read file twice: {path}\n{self.caller_lines()}")

    @staticmethod
    def is_allowed_file_read() -> bool:
        return any(frame.filename.endswith(reader) for frame in traceback.extract_stack(limit=CALLER_FRAMES) for reader in ALLOWED_FILE_READS)

    def note_file_write(self, path: str) -> None:
        self.file_reads.pop(path, None)


def audited(event: str, details: tuple[object, ...]) -> None:
    request = OPEN_REQUEST.get()
    if event == COMMAND_AUDIT_EVENT and request is not None:
        request.note_command(f"{details[1]} in {details[2]}")
    if event == FILE_READ_EVENT and request is not None:
        request.note_file_read(str(details[0]))
    if event == FILE_CHANGE_EVENT and request is not None:
        request.note_file_write(str(details[0]))


@cache
def watch_commands() -> None:
    sys.addaudithook(audited)
