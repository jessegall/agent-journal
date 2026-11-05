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
from core.testing.repeated_calls_error import RepeatedCallsError

READ_LIMIT_REPEATS = 5
COMMAND_LIMIT_REPEATS = 5
CALLER_FRAMES = 14
COMMAND_AUDIT_EVENT = "subprocess.Popen"
OPEN_REQUEST: ContextVar["RepeatedWork | None"] = ContextVar("open_request", default=None)
SCAN_TABLE = re.compile(r"\bSCAN(?: TABLE)? (\w+)")
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

    @contextmanager
    def request(self) -> Generator[None]:
        self.reads, self.commands, self.findings = Counter(), Counter(), []
        self.checked_plans.clear()
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
        for plan in self.database.query_plan(statement):
            if "USING COVERING INDEX" in plan or plan == "SCAN CONSTANT ROW":
                continue
            match = SCAN_TABLE.search(plan)
            if match is None or match.group(1) in SMALL_TABLES:
                continue
            self.findings.append(f"one request scanned {match.group(1)}: {plan}\n{statement.sql} {statement.parameters}\n{self.caller_lines()}")

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


def audited(event: str, details: tuple[object, ...]) -> None:
    request = OPEN_REQUEST.get()
    if event == COMMAND_AUDIT_EVENT and request is not None:
        request.note_command(f"{details[1]} in {details[2]}")


@cache
def watch_commands() -> None:
    sys.addaudithook(audited)
