import io
import os

import pytest

from engine.caller.caller_request import CallerRequest
from engine.cli.line_run import LineRun
from engine.enums.process_kind import ProcessKind
from engine.event.event_log import EventLog
from engine.query.queries import Queries
from engine.testing.examples.hook_samples import HookSamples
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.process import Process
from tests.stories.core.support.coding_fixtures import BuilderStarted

PROCESSES_TABLE = "processes"
HOOKS = {"prompt": lambda: HookSamples.prompt("hello"), "session start": HookSamples.session_start}
COMMANDS = (["task", "list"], ["agent", "list"], ["setting", "list"], ["doc", "list"], ["overview"])


def run_command(story, argv: list[str]) -> int:
    request = CallerRequest(dict(os.environ), os.getcwd(), os.getpid())
    return LineRun(story.home).run(argv, request, io.StringIO())


def process_events_of(story, work) -> list:
    """The events `work` logged on process rows: a row written once is one creation, a row that moved or ended
    afterwards is more, and each of those is what a listener of a run's end waits for."""
    log = story.container.get(EventLog)
    first = log.newest_id()
    work()
    return [event for event in log.events_after(first) if event.row_table == PROCESSES_TABLE]


def expect_one_row_written_once(story, events: list, kind: ProcessKind) -> None:
    rows = list(story.container.get(Queries).query(Process).filter(kind=kind.value).all_rows())
    written = [row for row in rows if row.id in {event.row_id for event in events}]
    story.expect_rows(len(events) == 1, events[0].is_creation, len(written) == 1, written[0].state in (ProcessState.FINISHED, ProcessState.FAILED), not written[0].slot_assigned,
                      detail=f"events {events}, rows {rows}")


@pytest.mark.parametrize("name", list(HOOKS))
def test_a_hook_writes_one_process_row_once_and_no_end_listener_has_work(new_story, name):
    story = new_story(fixture=BuilderStarted)
    events = process_events_of(story, lambda: story.hook("s-1", HOOKS[name]()))
    expect_one_row_written_once(story, events, ProcessKind.HOOK)


@pytest.mark.parametrize("argv", COMMANDS, ids=lambda argv: " ".join(argv))
def test_a_journal_command_writes_one_process_row_once_and_no_end_listener_has_work(new_story, argv):
    story = new_story(fixture=BuilderStarted)
    events = process_events_of(story, lambda: run_command(story, argv))
    expect_one_row_written_once(story, events, ProcessKind.JOURNAL)
