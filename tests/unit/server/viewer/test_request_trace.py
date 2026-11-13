import json
import sqlite3

import pytest

from core.modules.developer.migrations.m001_hook_requests import HookRequestsMigration
from core.modules.developer.support.trace_receipt import TraceReceipt
from core.modules.developer.support.trace_row import TraceRow
from engine.database.database import Database
from engine.database.hook_requests_table import HookRequestsTable
from engine.database.statement import Statement
from engine.journal.journal_home import JournalHome
from engine.time.clock import Clock
from server.viewer.request_trace import RequestTrace
from server.viewer.request_trace_settings import RequestTraceSettings

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
def trace(home) -> RequestTrace:
    enabled = RequestTrace(home, Clock())
    enabled.configuration = RequestTraceSettings(True, SIZE)
    return enabled


def stored_payloads(database: Database) -> list[dict]:
    return [json.loads(row["payload"]) for row in database.rows(Statement("SELECT payload FROM hook_requests ORDER BY id"))]


def write_twice(trace: RequestTrace, database: Database) -> None:
    # the first round moves the file aside, the next writes what it holds
    for _ in range(2):
        trace.trace_file.write_rows(database, HookRequestsTable(database), SIZE)


def test_busy_database_drops_no_row(trace, database, home):
    locker = sqlite3.connect(home.database, timeout=0, autocommit=True)
    locker.execute("BEGIN IMMEDIATE")
    try:
        trace.record(["task", "list"], "cli", 1.0, 0.0, 0)
        write_twice(trace, database)
    finally:
        locker.execute("ROLLBACK")
        locker.close()
    assert (trace.counts["recorded"], trace.counts["dropped"], stored_payloads(database)) == (1, 0, [])
    trace.trace_file.write_rows(database, HookRequestsTable(database), SIZE)
    assert [payload["body"]["event"] for payload in stored_payloads(database)] == ["task list"]


def test_rows_written_by_the_tick_keep_order(trace, database):
    for line in (["task", "list"], ["agent", "list"], ["plan", "list"]):
        trace.record(line, "cli", 1.0, 0.0, 0)
    viewer_row = {"body": {"event": "task show", "attribution": {"client_id": "client", "command_id": "command", "person_id": 1}}}
    trace.trace_file.append([TraceRow(json.dumps(viewer_row)), TraceReceipt(1, "client", "command", 2)])
    write_twice(trace, database)
    payloads = stored_payloads(database)
    assert [payload["body"]["event"] for payload in payloads] == ["task list", "agent list", "plan list", "task show"]
    assert payloads[-1]["body"]["attribution"]["joined_callers"] == 2


def test_disabled_trace_writes_no_file(home):
    trace = RequestTrace(home, Clock())
    trace.record(["task", "list"], "cli", 1.0, 0.0, 0)
    trace.complete_reads(1, ())
    assert trace.counts["disabled"] == 1
    assert not trace.trace_file.lines.path.exists()
