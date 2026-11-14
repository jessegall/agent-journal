import io
import os

import pytest

from core.modules.processes.models.request_run import RequestRun
from core.modules.processes.ticks.request_log_import import RequestLogImport
from engine.caller.caller_request import SESSION_VARIABLE, CallerRequest
from engine.cli.line_run import LineRun
from engine.enums.process_type import ProcessType
from engine.event.event_log import EventLog
from engine.query.queries import Queries
from engine.testing.examples.hook_samples import HookSamples
from tests.integration.support.integration_server import integration_server

EVERY_ROW_REASON = "the test reads every row it checks"
PROCESSES_TABLE = "processes"
REQUEST_RUNS_TABLE = "request_runs"
SESSION = "s-1"
HOOKS = {"prompt": lambda: HookSamples.prompt("hello"), "session start": HookSamples.session_start}
COMMANDS = (["task", "list"], ["agent", "list"], ["setting", "list"], ["doc", "list"], ["overview"])


def events_of(journal, work) -> list:
    """The events `work` and the two ticks that take and write the request log logged on request rows and on
    process rows. A request row is one creation; a hook or command logs no process row."""
    log = journal.container.get(EventLog)
    first = log.newest_id()
    work()
    RequestLogImport()(journal.container)
    RequestLogImport()(journal.container)
    return [event for event in log.events_after(first) if event.row_table in (REQUEST_RUNS_TABLE, PROCESSES_TABLE)]


def expect_single_request_row(journal, events: list, category: ProcessType) -> None:
    requests = [event for event in events if event.row_table == REQUEST_RUNS_TABLE]
    processes = [event for event in events if event.row_table == PROCESSES_TABLE]
    ids = {event.row_id for event in requests}
    rows = [row for row in journal.container.get(Queries).query(RequestRun).filter(process_type=category.value).every_row(EVERY_ROW_REASON) if row.id in ids]
    assert len(requests) == 1 and not processes and len(rows) == 1, f"events {events}, rows {rows}"
    assert requests[0].is_creation, events


@pytest.mark.parametrize("name", list(HOOKS))
def test_a_hook_writes_one_request_row_once_and_no_process_row(journal, name):
    with integration_server(journal) as server:
        server.start_agent(SESSION)
        RequestLogImport()(journal.container)
        RequestLogImport()(journal.container)
        body = dict(HOOKS[name]().with_fields(session=SESSION, firing=f"request-row-{name}").body)
        events = events_of(journal, lambda: server.expect_hook_answer("/hook", body, 200, '"refusal":'))
    expect_single_request_row(journal, events, ProcessType.HOOK)


@pytest.mark.parametrize("argv", COMMANDS, ids=lambda argv: " ".join(argv))
def test_a_journal_command_writes_one_request_row_once_and_no_process_row(journal, argv):
    journal.new_row_id(f"agent start {SESSION} claude main --environment main")
    request = CallerRequest({**os.environ, SESSION_VARIABLE: SESSION}, os.getcwd(), os.getpid())
    events = events_of(journal, lambda: LineRun(journal.home).run(argv, request, io.StringIO()))
    expect_single_request_row(journal, events, ProcessType.JOURNAL)
