import json

import pytest

from core.modules.agents.migrations.m022_agent_number import AgentNumberMigration
from core.modules.agents.migrations.m023_agent_sessions import AgentSessionsMigration
from core.modules.agents.testing.fake_launcher import FakeLauncher
from engine.database.database import Database
from engine.database.module_migrations import ModuleMigrations
from engine.database.schema import Schema
from engine.database.statement import Statement
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.modules.helpers.cold_sessions import aged
from tests.stories.core.modules.helpers.helper_jobs import EndedHelper, JOB, helper_agent, resumable_session
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.engine.upgrade.agent_number_migration import AgentsWithoutNumbers, agent_rows

COLD_MINUTES = 300
COLD_PERCENT = 100
NEW_SESSION_TEXT = "new session of"
UNAVAILABLE_TEXT = "The earlier conversation is unavailable"
REPLACED_REPLY = "replaced this one"
STORY_MODULE = "story"


class StoppedNumberMigration(AgentNumberMigration):
    """The number migration with a statement after its first that fails."""

    number = 9022
    statements = [AgentNumberMigration.statements[0], "UPDATE a_table_that_is_missing SET number = 1", *AgentNumberMigration.statements[1:]]


class WholeNumberMigration(AgentNumberMigration):
    """The number migration under the number the stopped one had."""

    number = 9022


class StoppedSessionsMigration(AgentSessionsMigration):
    """The history migration with a last statement that fails."""

    number = 9023
    statements = [*AgentSessionsMigration.statements, "UPDATE a_table_that_is_missing SET number = 1"]


class WholeSessionsMigration(AgentSessionsMigration):
    """The history migration under the number the stopped one had."""

    number = 9023


def session_row_count(story) -> int:
    return story.container.get(Database).rows(Statement("SELECT COUNT(*) AS session_rows FROM agent_sessions"))[0]["session_rows"]


def sessions_of(story, agent_id: int) -> str:
    return story.run(f"agent sessions {agent_number(story, agent_id)} --environment main", actor=story.user).output_text


def agent_count(story) -> int:
    return json.loads(story.run("agent list --environment main --json", actor=story.user).output_text)["total"]


def job_launch(story, launcher_answer: bytes = b"started 701\n") -> dict:
    launcher = FakeLauncher.accepting(story.home.socket("launcher"), answer=launcher_answer)
    story.expect_success(f'helper send {agent_number(story, helper_agent(story).id)} "{JOB}"', actor=story.agent)
    story.run_listeners()
    launcher.drain_requests()
    launcher.server.close()
    story.home.socket("launcher").unlink()
    story.expect_rows(len(launcher.requests) == 1, detail=str(launcher.requests))
    return launcher.requests[0]


@pytest.fixture
def cold_helper(new_story, monkeypatch):
    story = new_story(fixture=EndedHelper)
    resumable_session(story, helper_agent(story), monkeypatch)
    aged(story, COLD_MINUTES, COLD_PERCENT)
    return story


def test_a_new_session_of_the_main_agent_is_told_so_in_one_line_with_its_open_task_and_last_report(new_story):
    story = new_story(fixture=UserBuilder)
    story.hook("s-1", HookSamples.prompt("Remember the blue cart"))
    task = story.new_row_id('task make "Count the till" --brief "Count it and say the sum" --environment main', actor=story.user)
    story.expect_success(f"task assign {task} --to 1 --environment main", actor=story.user)
    story.expect_success('report make "Till count" --abstract "The till holds 40" --body "The till holds 40 coins."', actor=story.agent)
    reply = story.hook("s-2", HookSamples.session_start())
    session_lines = [line for line in reply.lines if NEW_SESSION_TEXT in line]
    story.expect_rows(len(session_lines) == 1, detail=str(reply.lines))
    story.expect_rows(f"task {task}" in session_lines[0], "report 1" in session_lines[0], "agent 1" in session_lines[0],
                      not any("blue cart" in line for line in reply.lines), detail=session_lines[0])


def test_agent_sessions_lists_each_session_with_its_program_start_end_and_the_reason_it_ended(new_story):
    story = new_story(fixture=UserBuilder)
    story.hook("s-2", HookSamples.session_start().with_fields(program="codex"))
    story.hook("s-3", HookSamples.session_start())
    rows = json.loads(story.run("agent sessions 1 --environment main --json", actor=story.user).output_text)["rows"]
    story.expect_rows([(row["session"], row["program"], row["end_reason"]) for row in rows]
                      == [("s-3", "claude", None), ("s-2", "codex", "replaced_by_person"), ("s-1", "claude", "replaced_by_person")], detail=str(rows))
    story.expect_rows(all(row["started_at"] for row in rows), [bool(row["ended_at"]) for row in rows] == [False, True, True], all("model" in row for row in rows))


def test_a_late_hook_from_the_old_session_of_a_helper_is_answered_replaced_and_makes_no_agent(cold_helper):
    story = cold_helper
    old_session = helper_agent(story).session
    job_launch(story)
    count = agent_count(story)
    story.expect_rows(helper_agent(story).session != old_session)
    story.expect_hook_refusal(old_session, HookSamples.edit("a.py"), REPLACED_REPLY)
    story.expect_rows(agent_count(story) == count)


def test_a_helper_whose_transcript_is_gone_starts_a_new_session_and_is_told_the_conversation_is_unavailable(new_story):
    story = new_story(fixture=EndedHelper)
    helper = helper_agent(story)
    command = " ".join(job_launch(story)["command"])
    story.expect_rows(helper_agent(story).id == helper.id, helper_agent(story).session != helper.session, helper.session not in command,
                      UNAVAILABLE_TEXT in command, NEW_SESSION_TEXT in command, detail=command)
    story.expect_absent(f"agent show {agent_number(story, helper.id)} --environment main", f"session: {helper.session}", actor=story.user)
    story.expect_text(f"agent sessions {agent_number(story, helper.id)} --environment main", helper.session, "conversation_missing", actor=story.user)


def test_a_replacement_the_launcher_cannot_start_keeps_its_new_session_and_the_retry_starts_that_session(cold_helper):
    story = cold_helper
    helper = helper_agent(story)
    story.run(f'helper send {agent_number(story, helper.id)} "{JOB}"', actor=story.agent)
    story.run_listeners()
    unstarted_session = helper_agent(story).session
    story.expect_rows(unstarted_session != helper.session)
    story.expect_text(f"agent-line list --agent {story.agent.id}", "failed to start")
    command = " ".join(job_launch(story)["command"])
    story.expect_rows(helper_agent(story).session == unstarted_session, unstarted_session in command, detail=command)
    story.expect_rows(sessions_of(story, helper.id).count(unstarted_session) == 1)


def test_after_a_server_stop_between_replacement_and_launch_the_next_job_starts_the_unstarted_session(cold_helper):
    story = cold_helper
    helper = helper_agent(story)
    story.run(f'helper send {agent_number(story, helper.id)} "{JOB}"', actor=story.agent)
    unstarted_session = helper_agent(story).session
    story.expect_rows(unstarted_session != helper.session)
    command = " ".join(job_launch(story)["command"])
    story.expect_rows(helper_agent(story).session == unstarted_session, unstarted_session in command, detail=command)


def test_the_number_migration_stopped_half_way_rolls_back_and_a_second_run_finishes(new_story):
    story = new_story(fixture=AgentsWithoutNumbers)
    rows = agent_rows(story)
    schema = story.container.get(Schema)
    with pytest.raises(Exception, match="a_table_that_is_missing"):
        schema.migrate([ModuleMigrations(STORY_MODULE, [StoppedNumberMigration()])])
    story.expect_rows(agent_rows(story) == rows)
    story.expect_rows(schema.migrate([ModuleMigrations(STORY_MODULE, [WholeNumberMigration()])]) == [f"{STORY_MODULE} {WholeNumberMigration.number}"])
    story.expect_rows(story.container.get(Database).rows(Statement("SELECT COUNT(*) AS unnumbered FROM agents WHERE number IS NULL"))[0]["unnumbered"] == 0)


def test_the_history_migration_stopped_half_way_rolls_back_and_a_second_run_gives_every_agent_its_row(new_story):
    story = new_story(fixture=AgentsWithoutNumbers)
    agents = len(agent_rows(story))
    story.container.get(Database).update(Statement("DELETE FROM agent_sessions"))
    schema = story.container.get(Schema)
    with pytest.raises(Exception, match="a_table_that_is_missing"):
        schema.migrate([ModuleMigrations(STORY_MODULE, [StoppedSessionsMigration()])])
    story.expect_rows(session_row_count(story) == 0)
    schema.migrate([ModuleMigrations(STORY_MODULE, [WholeSessionsMigration()])])
    story.expect_rows(session_row_count(story) == agents, detail=str(agents))
