import io
import contextlib
import sqlite3

import pytest
from datetime import timedelta

from engine.enums.process_type import ProcessType
from engine.errors.refusal import Refusal
from engine.process.door.execution_request import ExecutionRequest
from engine.process.door.process_executor import ProcessExecutor
from engine.actor.actor import Actor
from engine.caller.caller import Caller
from engine.cli.line_run import LineRun
from engine.enums.actor_type import ActorType
from engine.database.database import Database
from engine.file.file_access import FileAccess
from engine.row.row_owner import MAIN_AGENT, RowOwner
from engine.testing.examples.hook_samples import HookSamples
from core.modules.processes.models.process import Process
from core.modules.processes.commands.record_request_runs.record_request_runs_handler import RecordRequestRunsHandler
from core.modules.processes.models.request_run import RequestRun
from core.modules.processes.support.request_log import RequestLog
from core.modules.processes.support.request_log_entry import RequestLogEntry
from core.modules.processes.ticks.request_log_import import RequestLogImport
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.core.support.fixtures import UserJoined



MISSING_ENVIRONMENT_ID = 999


def door_run(story, request: ExecutionRequest):
    story.container.get(Database).row_owner = RowOwner(MAIN_AGENT, 1)
    return story.container.get(ProcessExecutor).execute(request)


def logged_rows_saved(story) -> None:
    RequestLogImport()(story.container)
    RequestLogImport()(story.container)


def category_runs(story, category: ProcessType) -> list[RequestRun]:
    return list(story.story_rows(RequestRun, process_type=category.value))








def test_a_journal_command_is_logged_without_a_write_and_the_tick_writes_each_logged_command_as_one_row(played):
    story = played(BuilderStarted)
    log = story.container.get(RequestLog)
    ended_at = story.clock.timestamp().text
    log.append(RequestLogEntry(1, None, ProcessType.JOURNAL, "journal task list", 0, ended_at))
    log.append(RequestLogEntry(1, None, ProcessType.JOURNAL, "journal task show", 1, ended_at))
    requests_previous = len(category_runs(story, ProcessType.JOURNAL))
    logged_rows_saved(story)
    rows = category_runs(story, ProcessType.JOURNAL)[requests_previous:]
    story.expect_rows(requests_previous == 0, [(row.line, row.exit_code, row.session_agent_id) for row in rows] == [("journal task list", 0, story.agent.id), ("journal task show", 1, story.agent.id)],
                      log.claimed() == (), detail=str(rows))


def test_a_broken_line_in_the_request_log_is_left_out_and_the_rows_around_it_are_written(played):
    story = played(BuilderStarted)
    log = story.container.get(RequestLog)
    log.append(RequestLogEntry(1, None, ProcessType.JOURNAL, "journal task list", 0, story.clock.timestamp().text))
    FileAccess.write(log.lines.path, FileAccess.read(log.lines.path) + "{half a line\n" + "{\"line\": \"journal task done\"}\n")
    log.append(RequestLogEntry(1, None, ProcessType.JOURNAL, "journal task show", 0, story.clock.timestamp().text))
    logged_rows_saved(story)
    story.expect_rows([row.line for row in category_runs(story, ProcessType.JOURNAL)] == ["journal task list", "journal task show"], not log.lines.taken_path.exists())


def test_a_failed_environment_in_the_request_log_is_let_go_and_repeats_no_row_of_the_others(played, monkeypatch):
    story = played(BuilderStarted)
    saved = RecordRequestRunsHandler.handle

    def failing_for_one_environment(handler, command, context):
        if context.environment_id == MISSING_ENVIRONMENT_ID:
            raise RuntimeError("the write of this environment fails")
        return saved(handler, command, context)

    monkeypatch.setattr(RecordRequestRunsHandler, "handle", failing_for_one_environment)
    log = story.container.get(RequestLog)
    log.append(RequestLogEntry(1, None, ProcessType.JOURNAL, "journal task list", 0, story.clock.timestamp().text))
    log.append(RequestLogEntry(MISSING_ENVIRONMENT_ID, None, ProcessType.JOURNAL, "journal task show", 0, story.clock.timestamp().text))
    RequestLogImport()(story.container)
    for _ in range(2):
        with contextlib.suppress(Exception):
            RequestLogImport()(story.container)
    story.expect_rows([row.line for row in category_runs(story, ProcessType.JOURNAL)] == ["journal task list"], log.claimed() == ())


def test_a_busy_database_keeps_the_rows_of_an_environment_for_the_next_tick_and_a_bad_entry_alone_is_let_go(played, monkeypatch):
    story = played(BuilderStarted)
    saved = RecordRequestRunsHandler.handle
    outcomes = {"busy": True}

    def failing(handler, command, context):
        if outcomes["busy"]:
            busy = sqlite3.OperationalError("database is locked")
            busy.sqlite_errorcode = sqlite3.SQLITE_BUSY
            raise busy
        if any(entry.line == "journal task bad" for entry in command.entries):
            raise RuntimeError("this entry fails")
        return saved(handler, command, context)

    monkeypatch.setattr(RecordRequestRunsHandler, "handle", failing)
    log = story.container.get(RequestLog)
    for line in ("journal task list", "journal task bad", "journal task show"):
        log.append(RequestLogEntry(1, None, ProcessType.JOURNAL, line, 0, story.clock.timestamp().text))
    RequestLogImport()(story.container)
    story.expect_rows(len(log.claimed()) == 3, category_runs(story, ProcessType.JOURNAL) == [])
    outcomes["busy"] = False
    RequestLogImport()(story.container)
    RequestLogImport()(story.container)
    story.expect_rows(sorted(row.line for row in category_runs(story, ProcessType.JOURNAL)) == ["journal task list", "journal task show"], log.claimed() == ())


def test_a_request_row_older_than_its_days_is_pruned(played):
    story = played(BuilderStarted)
    log = story.container.get(RequestLog)
    log.append(RequestLogEntry(1, None, ProcessType.JOURNAL, "journal task list", 0, (story.clock.timestamp().value - timedelta(days=30)).isoformat()))
    log.append(RequestLogEntry(1, None, ProcessType.JOURNAL, "journal task show", 0, story.clock.timestamp().text))
    logged_rows_saved(story)
    story.expect_rows([row.line for row in category_runs(story, ProcessType.JOURNAL)] == ["journal task show"])




def agent_run(story, owner: RowOwner, request: ExecutionRequest):
    story.container.get(Database).row_owner = owner
    return story.container.get(ProcessExecutor).execute(request)


