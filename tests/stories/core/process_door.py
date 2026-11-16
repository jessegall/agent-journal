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
from tests.stories.core.support.agent_labels import agent_number



MISSING_ENVIRONMENT_ID = 999


def door_run(story, request: ExecutionRequest):
    story.container.get(Database).row_owner = RowOwner(MAIN_AGENT, 1)
    return story.container.get(ProcessExecutor).execute(request)


def logged_rows_saved(story) -> None:
    RequestLogImport()(story.container)
    RequestLogImport()(story.container)


def category_runs(story, category: ProcessType) -> list[RequestRun]:
    return list(story.story_rows(RequestRun, process_type=category.value))


def test_each_hook_leaves_one_ended_request_row_of_the_hook_kind_and_no_process_row(new_story):
    story = new_story(fixture=BuilderStarted)
    processes_previous = story.row_count(Process)
    story.hook("s-1", HookSamples.sample("stop"))
    logged_rows_saved(story)
    rows = [row for row in category_runs(story, ProcessType.HOOK) if row.line == "claude stop"]
    story.expect_rows(len(rows) == 1, rows[0].exit_code == 0, rows[0].session_agent_id == story.agent.id,
                      story.row_count(Process) == processes_previous, detail=str(rows))


def test_a_quick_run_through_the_door_is_logged_and_the_tick_writes_one_ended_request_row(new_story):
    story = new_story(fixture=BuilderStarted)
    processes_previous = story.row_count(Process)
    execution = door_run(story, ExecutionRequest(["echo", "done"], story.home.project_folder, ProcessType.QUICK, 10))
    unrecorded = category_runs(story, ProcessType.QUICK)
    logged_rows_saved(story)
    rows = category_runs(story, ProcessType.QUICK)
    story.expect_rows(execution.stdout == "done\n", unrecorded == [], len(rows) == 1, rows[0].exit_code == 0, story.row_count(Process) == processes_previous, detail=str(rows))


def test_a_failing_run_through_the_door_keeps_its_code(new_story):
    story = new_story(fixture=BuilderStarted)
    execution = door_run(story, ExecutionRequest(["sh", "-c", "exit 3"], story.home.project_folder, ProcessType.SHELL, 10))
    logged_rows_saved(story)
    row = category_runs(story, ProcessType.SHELL)[0]
    story.expect_rows(execution.exit_code == 3, row.exit_code == 3, detail=str(row))












def test_a_journal_command_an_agent_runs_through_the_cli_leaves_one_row_as_that_agent(new_story):
    story = new_story(fixture=BuilderStarted)
    LineRun(story.home).run_as(["task", "list", "--environment", "main"], lambda container: Caller(Actor(story.agent.id, ActorType.AGENT)), io.StringIO())
    logged_rows_saved(story)
    rows = [row for row in category_runs(story, ProcessType.JOURNAL) if row.line == "journal task list"]
    story.expect_rows(len(rows) == 1, rows[0].session_agent_id == story.agent.id, detail=str(rows))


def agent_run(story, owner: RowOwner, request: ExecutionRequest):
    story.container.get(Database).row_owner = owner
    return story.container.get(ProcessExecutor).execute(request)


def test_a_paused_agent_or_main_agent_starts_no_run_that_takes_a_place_until_it_is_resumed_and_other_agents_go_on(new_story):
    story = new_story(fixture=UserJoined)
    worker = RowOwner(story.new_row_id("agent start s-paused claude worker --environment main"), 1)
    story.run(f"agent pause {agent_number(story, worker.agent)}", actor=story.user)
    shell = ExecutionRequest(["sh", "-c", "exit 0"], story.home.project_folder, ProcessType.SHELL, 10)
    quick = ExecutionRequest(["sh", "-c", "exit 0"], story.home.project_folder, ProcessType.QUICK, 10)
    with pytest.raises(Refusal, match="your agent is paused"):
        agent_run(story, worker, shell)
    quick_while_paused = agent_run(story, worker, quick)
    main_while_worker_paused = agent_run(story, RowOwner(MAIN_AGENT, 1), shell)
    story.run(f"agent resume {agent_number(story, worker.agent)}", actor=story.user)
    resumed = agent_run(story, worker, shell)
    story.run(f"agent pause {agent_number(story, story.agent.agent_id())}", actor=story.user)
    with pytest.raises(Refusal, match="your agent is paused"):
        agent_run(story, RowOwner(MAIN_AGENT, 1), shell)
    story.expect_rows(quick_while_paused.exit_code == 0, main_while_worker_paused.exit_code == 0, resumed.exit_code == 0)
