import io
import os

import pytest

from engine.caller.caller_request import SESSION_VARIABLE, CallerRequest
from engine.cli.line_run import LineRun
from engine.enums.process_kind import ProcessKind
from engine.event.event_log import EventLog
from engine.query.queries import Queries
from engine.testing.examples.hook_samples import HookSamples
from core.modules.processes.models.request_run import RequestRun
from core.modules.processes.ticks.request_log_import import RequestLogImport
from tests.stories.core.support.coding_fixtures import BuilderStarted

TEST_ROWS_REASON = "the test reads every row it checks"

PROCESSES_TABLE = "processes"
REQUEST_RUNS_TABLE = "request_runs"
HOOKS = {"prompt": lambda: HookSamples.prompt("hello"), "session start": HookSamples.session_start}
COMMANDS = (["task", "list"], ["agent", "list"], ["setting", "list"], ["doc", "list"], ["overview"])


def run_command(story, argv: list[str]) -> int:
    request = CallerRequest({**os.environ, SESSION_VARIABLE: "s-1"}, os.getcwd(), os.getpid())
    return LineRun(story.home).run(argv, request, io.StringIO())


def events_of(story, work) -> list:
    """The events `work` and the two ticks that take and write the request log logged on request rows and on
    process rows. A request row is one creation. A process row would be what a listener of a run's end waits for,
    so a hook or command logs none."""
    log = story.container.get(EventLog)
    first = log.newest_id()
    work()
    RequestLogImport()(story.container)
    RequestLogImport()(story.container)
    return [event for event in log.events_after(first) if event.row_table in (REQUEST_RUNS_TABLE, PROCESSES_TABLE)]


def expect_one_request_row_written_once(story, events: list, category: ProcessKind) -> None:
    requests = [event for event in events if event.row_table == REQUEST_RUNS_TABLE]
    processes = [event for event in events if event.row_table == PROCESSES_TABLE]
    rows = [row for row in story.container.get(Queries).query(RequestRun).filter(kind=category.value).every_row(TEST_ROWS_REASON) if row.id in {event.row_id for event in requests}]
    story.expect_rows(len(requests) == 1, not processes, len(rows) == 1, detail=f"events {events}, rows {rows}")
    story.expect_rows(requests[0].is_creation, detail=f"events {events}")


@pytest.mark.parametrize("name", list(HOOKS))
def test_a_hook_writes_one_request_row_once_and_no_process_row(new_story, name):
    story = new_story(fixture=BuilderStarted)
    events = events_of(story, lambda: story.hook("s-1", HOOKS[name]()))
    expect_one_request_row_written_once(story, events, ProcessKind.HOOK)


@pytest.mark.parametrize("argv", COMMANDS, ids=lambda argv: " ".join(argv))
def test_a_journal_command_writes_one_request_row_once_and_no_process_row(new_story, argv):
    story = new_story(fixture=BuilderStarted)
    events = events_of(story, lambda: run_command(story, argv))
    expect_one_request_row_written_once(story, events, ProcessKind.JOURNAL)
