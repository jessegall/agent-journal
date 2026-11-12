import io
import contextlib
import sqlite3
from datetime import timedelta

from engine.enums.process_kind import ProcessKind
from engine.process.door.execution_request import ExecutionRequest
from engine.process.door.process_executor import ProcessExecutor
from engine.actor.actor import Actor
from engine.caller.caller import Caller
from engine.cli.line_run import LineRun
from engine.enums.actor_type import ActorType
from engine.database.database import Database
from engine.file.file_access import FileAccess
from engine.query.queries import Queries
from engine.row.row_owner import MAIN_AGENT, RowOwner
from engine.testing.examples.hook_samples import HookSamples
from core.modules.processes.models.process import Process
from core.modules.processes.commands.record_request_runs.record_request_runs_handler import RecordRequestRunsHandler
from core.modules.processes.models.request_run import RequestRun
from core.modules.processes.support.request_log import RequestLog
from core.modules.processes.support.request_log_entry import RequestLogEntry
from core.modules.processes.ticks.request_log_import import RequestLogImport
from tests.stories.core.support.coding_fixtures import BuilderStarted


MISSING_ENVIRONMENT_ID = 999


def door_run(story, request: ExecutionRequest):
    story.container.get(Database).row_owner = RowOwner(MAIN_AGENT, 1)
    return story.container.get(ProcessExecutor).execute(request)


def logged_rows_written(story) -> None:
    RequestLogImport()(story.container)
    RequestLogImport()(story.container)


def runs_of_kind(story, kind: ProcessKind) -> list[RequestRun]:
    return list(story.container.get(Queries).query(RequestRun).filter(kind=kind.value).all_rows())


def test_each_hook_leaves_one_ended_request_row_of_the_hook_kind_and_no_process_row(new_story):
    story = new_story(fixture=BuilderStarted)
    processes_before = story.container.get(Queries).query(Process).count()
    story.hook("s-1", HookSamples.sample("stop"))
    logged_rows_written(story)
    rows = [row for row in runs_of_kind(story, ProcessKind.HOOK) if row.line == "claude stop"]
    story.expect_rows(len(rows) == 1, rows[0].exit_code == 0, rows[0].session_agent_id == story.agent.id,
                      story.container.get(Queries).query(Process).count() == processes_before, detail=str(rows))


def test_a_quick_run_through_the_door_is_logged_and_the_tick_writes_one_ended_request_row(new_story):
    story = new_story(fixture=BuilderStarted)
    processes_before = story.container.get(Queries).query(Process).count()
    execution = door_run(story, ExecutionRequest(["echo", "done"], story.home.project_folder, ProcessKind.QUICK, 10))
    logged_only = runs_of_kind(story, ProcessKind.QUICK)
    logged_rows_written(story)
    rows = runs_of_kind(story, ProcessKind.QUICK)
    story.expect_rows(execution.stdout == "done\n", logged_only == [], len(rows) == 1, rows[0].exit_code == 0, story.container.get(Queries).query(Process).count() == processes_before, detail=str(rows))


def test_a_failing_run_through_the_door_keeps_its_code(new_story):
    story = new_story(fixture=BuilderStarted)
    execution = door_run(story, ExecutionRequest(["sh", "-c", "exit 3"], story.home.project_folder, ProcessKind.SHELL, 10))
    logged_rows_written(story)
    row = runs_of_kind(story, ProcessKind.SHELL)[0]
    story.expect_rows(execution.exit_code == 3, row.exit_code == 3, detail=str(row))


def test_a_journal_command_is_logged_without_a_write_and_the_tick_writes_each_logged_command_as_one_row(new_story):
    story = new_story(fixture=BuilderStarted)
    log = story.container.get(RequestLog)
    ended_at = story.clock.timestamp().text
    log.append(RequestLogEntry(1, None, ProcessKind.JOURNAL, "journal task list", 0, ended_at))
    log.append(RequestLogEntry(1, None, ProcessKind.JOURNAL, "journal task show", 1, ended_at))
    requests_before = len(runs_of_kind(story, ProcessKind.JOURNAL))
    logged_rows_written(story)
    rows = runs_of_kind(story, ProcessKind.JOURNAL)[requests_before:]
    story.expect_rows(requests_before == 0, [(row.line, row.exit_code, row.session_agent_id) for row in rows] == [("journal task list", 0, story.agent.id), ("journal task show", 1, story.agent.id)],
                      log.taken() == (), detail=str(rows))


def test_a_broken_line_in_the_request_log_is_left_out_and_the_rows_around_it_are_written(new_story):
    story = new_story(fixture=BuilderStarted)
    log = story.container.get(RequestLog)
    log.append(RequestLogEntry(1, None, ProcessKind.JOURNAL, "journal task list", 0, story.clock.timestamp().text))
    FileAccess.shared().write(log.path, FileAccess.shared().read(log.path) + "{half a line\n" + "{\"line\": \"journal task done\"}\n")
    log.append(RequestLogEntry(1, None, ProcessKind.JOURNAL, "journal task show", 0, story.clock.timestamp().text))
    logged_rows_written(story)
    story.expect_rows([row.line for row in runs_of_kind(story, ProcessKind.JOURNAL)] == ["journal task list", "journal task show"], not log.taken_path.exists())


def test_a_failed_environment_in_the_request_log_is_let_go_and_repeats_no_row_of_the_others(new_story, monkeypatch):
    story = new_story(fixture=BuilderStarted)
    written = RecordRequestRunsHandler.handle

    def failing_for_one_environment(handler, command, context):
        if context.environment_id == MISSING_ENVIRONMENT_ID:
            raise RuntimeError("the write of this environment fails")
        return written(handler, command, context)

    monkeypatch.setattr(RecordRequestRunsHandler, "handle", failing_for_one_environment)
    log = story.container.get(RequestLog)
    log.append(RequestLogEntry(1, None, ProcessKind.JOURNAL, "journal task list", 0, story.clock.timestamp().text))
    log.append(RequestLogEntry(MISSING_ENVIRONMENT_ID, None, ProcessKind.JOURNAL, "journal task show", 0, story.clock.timestamp().text))
    RequestLogImport()(story.container)
    for _ in range(2):
        with contextlib.suppress(Exception):
            RequestLogImport()(story.container)
    story.expect_rows([row.line for row in runs_of_kind(story, ProcessKind.JOURNAL)] == ["journal task list"], log.taken() == ())


def test_a_busy_database_keeps_the_rows_of_an_environment_for_the_next_tick_and_a_bad_entry_alone_is_let_go(new_story, monkeypatch):
    story = new_story(fixture=BuilderStarted)
    written = RecordRequestRunsHandler.handle
    outcomes = {"busy": True}

    def failing(handler, command, context):
        if outcomes["busy"]:
            busy = sqlite3.OperationalError("database is locked")
            busy.sqlite_errorcode = sqlite3.SQLITE_BUSY
            raise busy
        if any(entry.line == "journal task bad" for entry in command.entries):
            raise RuntimeError("this entry fails")
        return written(handler, command, context)

    monkeypatch.setattr(RecordRequestRunsHandler, "handle", failing)
    log = story.container.get(RequestLog)
    for line in ("journal task list", "journal task bad", "journal task show"):
        log.append(RequestLogEntry(1, None, ProcessKind.JOURNAL, line, 0, story.clock.timestamp().text))
    RequestLogImport()(story.container)
    story.expect_rows(len(log.taken()) == 3, runs_of_kind(story, ProcessKind.JOURNAL) == [])
    outcomes["busy"] = False
    RequestLogImport()(story.container)
    RequestLogImport()(story.container)
    story.expect_rows(sorted(row.line for row in runs_of_kind(story, ProcessKind.JOURNAL)) == ["journal task list", "journal task show"], log.taken() == ())


def test_a_request_row_older_than_its_days_is_pruned(new_story):
    story = new_story(fixture=BuilderStarted)
    log = story.container.get(RequestLog)
    log.append(RequestLogEntry(1, None, ProcessKind.JOURNAL, "journal task list", 0, (story.clock.timestamp().value - timedelta(days=30)).isoformat()))
    log.append(RequestLogEntry(1, None, ProcessKind.JOURNAL, "journal task show", 0, story.clock.timestamp().text))
    logged_rows_written(story)
    story.expect_rows([row.line for row in runs_of_kind(story, ProcessKind.JOURNAL)] == ["journal task show"])


def test_a_journal_command_an_agent_runs_through_the_cli_leaves_one_row_as_that_agent(new_story):
    story = new_story(fixture=BuilderStarted)
    LineRun(story.home).run_as(["task", "list", "--environment", "main"], lambda container: Caller(Actor(story.agent.id, ActorType.AGENT)), io.StringIO())
    logged_rows_written(story)
    rows = [row for row in runs_of_kind(story, ProcessKind.JOURNAL) if row.line == "journal task list"]
    story.expect_rows(len(rows) == 1, rows[0].session_agent_id == story.agent.id, detail=str(rows))
