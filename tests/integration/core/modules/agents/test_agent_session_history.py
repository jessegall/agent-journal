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
from tests.integration.core.modules.helpers.test_cold_sessions import aged
from tests.integration.core.modules.helpers.test_helper_jobs import EndedHelper, JOB, helper_agent, resumable_session
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
def cold_helper(played):
    story = played(EndedHelper)
    resumable_session(story, helper_agent(story))
    aged(story, COLD_MINUTES, COLD_PERCENT)
    return story














def test_the_number_migration_stopped_half_way_rolls_back_and_a_second_run_finishes(played):
    story = played(AgentsWithoutNumbers)
    rows = agent_rows(story)
    schema = story.container.get(Schema)
    with pytest.raises(Exception, match="a_table_that_is_missing"):
        schema.migrate([ModuleMigrations(STORY_MODULE, [StoppedNumberMigration()])])
    story.expect_rows(agent_rows(story) == rows)
    story.expect_rows(schema.migrate([ModuleMigrations(STORY_MODULE, [WholeNumberMigration()])]) == [f"{STORY_MODULE} {WholeNumberMigration.number}"])
    story.expect_rows(story.container.get(Database).rows(Statement("SELECT COUNT(*) AS unnumbered FROM agents WHERE number IS NULL"))[0]["unnumbered"] == 0)


def test_the_history_migration_stopped_half_way_rolls_back_and_a_second_run_gives_every_agent_its_row(played):
    story = played(AgentsWithoutNumbers)
    agents = len(agent_rows(story))
    story.container.get(Database).update(Statement("DELETE FROM agent_sessions"))
    schema = story.container.get(Schema)
    with pytest.raises(Exception, match="a_table_that_is_missing"):
        schema.migrate([ModuleMigrations(STORY_MODULE, [StoppedSessionsMigration()])])
    story.expect_rows(session_row_count(story) == 0)
    schema.migrate([ModuleMigrations(STORY_MODULE, [WholeSessionsMigration()])])
    story.expect_rows(session_row_count(story) == agents, detail=str(agents))
