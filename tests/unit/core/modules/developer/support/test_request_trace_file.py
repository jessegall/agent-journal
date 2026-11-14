import json
import sqlite3

import pytest

from core.modules.developer.migrations.m001_hook_requests import HookRequestsMigration
from core.modules.developer.support.request_trace_file import RequestTraceFile
from core.modules.developer.support.trace_receipt import TraceReceipt
from core.modules.developer.support.trace_row import TraceRow
from engine.database.database import Database
from engine.database.hook_requests_table import HookRequestsTable
from engine.database.statement import Statement
from engine.file.file_access import FileAccess
from engine.journal.journal_home import JournalHome

SIZE = 10


@pytest.fixture
def home(tmp_path) -> JournalHome:
    return JournalHome(tmp_path)


@pytest.fixture
def database(home):
    opened = Database.opened(home)
    HookRequestsMigration().run(opened)
    opened.set_busy_timeout(0)
    yield opened
    opened.close()


@pytest.fixture
def trace_file(home) -> RequestTraceFile:
    return RequestTraceFile(home, FileAccess())


def row(event: str) -> TraceRow:
    return TraceRow(json.dumps({"body": {"event": event, "attribution": {"client_id": "client", "command_id": event, "person_id": 1}}}))


def stored_payloads(database: Database) -> list[dict]:
    return [json.loads(stored["payload"]) for stored in database.rows(Statement("SELECT payload FROM hook_requests ORDER BY id"))]


def import_twice(trace_file: RequestTraceFile, database: Database) -> None:
    # the first round moves the file aside, the next writes what it holds
    for _ in range(2):
        trace_file.import_rows(database, HookRequestsTable(database), SIZE)


def test_busy_database_drops_no_row(trace_file, database, home):
    trace_file.append([row("task list")])
    locker = sqlite3.connect(home.database, timeout=0, autocommit=True)
    locker.execute("BEGIN IMMEDIATE")
    try:
        import_twice(trace_file, database)
    finally:
        locker.execute("ROLLBACK")
        locker.close()
    assert stored_payloads(database) == []
    trace_file.import_rows(database, HookRequestsTable(database), SIZE)
    assert [payload["body"]["event"] for payload in stored_payloads(database)] == ["task list"]


def test_rows_written_by_the_tick_keep_order(trace_file, database):
    trace_file.append([row("task list"), row("agent list")])
    trace_file.append([row("plan list"), TraceReceipt(1, "client", "agent list", 2)])
    import_twice(trace_file, database)
    payloads = stored_payloads(database)
    assert [payload["body"]["event"] for payload in payloads] == ["task list", "agent list", "plan list"]
    assert [payload["body"]["attribution"].get("joined_callers") for payload in payloads] == [None, 2, None]
