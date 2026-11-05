from collections import Counter
from collections.abc import Generator, Sequence
from contextlib import contextmanager
from contextvars import ContextVar
from functools import cache
import sqlite3
import re
import sys
import traceback

from core.base.database.point_tally import PointTally
from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.file_access import FILE_READ_EVENT, FILE_CHANGE_EVENT
from core.testing.repeated_calls_error import RepeatedCallsError

READ_LIMIT_REPEATS = 5
COMMAND_LIMIT_REPEATS = 5
CALLER_FRAMES = 14
COMMAND_AUDIT_EVENT = "subprocess.Popen"
OPEN_REQUEST: ContextVar["RepeatedWork | None"] = ContextVar("open_request", default=None)
SCAN_TABLE = re.compile(r"\bSCAN(?: TABLE)? (\w+)")
SCAN_INDEX = re.compile(r"\bUSING INDEX (\w+)")
BOUNDED_PAGE = re.compile(r"^SELECT \* FROM (\w+)(?: ORDER BY id (?:ASC|DESC))? LIMIT ([1-9]\d*|\?) OFFSET (\d+|\?)$", re.IGNORECASE)
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
}


class RepeatedWork(PointTally):
    """Counts the points of a story's database and raises when one request runs the same read too often with no
    write in between, or starts the same command too often. A hook and a command line are each one request."""

    def __init__(self, database: Database) -> None:
        super().__init__()
        self.database = database
        self.reads: Counter[Statement] = Counter()
        self.commands: Counter[str] = Counter()
        self.findings: list[str] = []
        self.checked_plans: set[Statement] = set()
        self.allowed_scans: dict[Statement, str] = {}
        self.file_reads: Counter[str] = Counter()

    @contextmanager
    def request(self) -> Generator[None]:
        self.reads, self.commands, self.findings = Counter(), Counter(), []
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
        self.check_scan(statement)
        self.reads[statement] += 1
        if self.reads[statement] == READ_LIMIT_REPEATS + 1:
            self.findings.append(f"one request read this more than {READ_LIMIT_REPEATS} times with no write in between: {statement.sql} {statement.parameters}\n{self.caller_lines()}")

    def check_scan(self, statement: Statement) -> None:
        if statement in self.checked_plans:
            return
        self.checked_plans.add(statement)
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
            if page is not None and page.group(1) == match.group(1) and self.has_page_bounds(page, statement):
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
        if table == "json_each":
            return any(plan.startswith("SCAN json_each VIRTUAL TABLE INDEX") for plan in plans)
        return any(plan in (f"CO-ROUTINE {table}", f"MATERIALIZE {table}") for plan in plans)

    @staticmethod
    def caller_lines() -> str:
        return "".join(f"  {frame.filename}:{frame.lineno} {frame.name}\n" for frame in traceback.extract_stack(limit=CALLER_FRAMES))

    def count_write(self, sql: str) -> None:
        super().count_write(sql)
        self.reads.clear()

    def note_command(self, command: str) -> None:
        self.commands[command] += 1
        if self.commands[command] == COMMAND_LIMIT_REPEATS + 1:
            self.findings.append(f"one request started this more than {COMMAND_LIMIT_REPEATS} times: {command}")

    def note_file_read(self, path: str) -> None:
        self.file_reads[path] += 1
        if self.file_reads[path] == 2:
            self.findings.append(f"one request read file twice: {path}\n{self.caller_lines()}")

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
