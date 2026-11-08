import pytest

from core.base.database.database import Database
from core.base.database.statement import Statement
from core.modules.drivers.models.support.views import AGENT_ACTIVITIES_SELECT
from tests.stories.core.support.fixtures import AgentStarted


@pytest.mark.parametrize(("condition", "parameters", "index"), [
    ("answer = ?", ["refused"], "hook_calls_refused"),
    ("hook <> 'tick'", (), "hook_calls_non_tick"),
])
def test_latest_matching_hook_reads_one_row_with_an_index(new_story, condition, parameters, index):
    story = new_story(fixture=AgentStarted)
    database = story.container.get(Database)
    agent = story.agent.id
    database.connection.executemany(
        "INSERT INTO hook_calls (session_agent_id, environment_id, creator_id, hook, firing, answer, created_at, updated_at) VALUES (?, 1, ?, ?, ?, ?, '', '')",
        [(agent, agent, 'tool' if n == 0 else 'tick', str(n), 'refused' if n == 0 else 'allowed') for n in range(1000)],
    )
    statement = Statement(f"SELECT * FROM hook_calls WHERE session_agent_id = ? AND {condition} ORDER BY id DESC LIMIT 1", (agent, *parameters))
    story.expect_rows(any(index in line for line in database.query_plan(statement)))
    initial_reads = database.repeated_work.points().tables['hook_calls']
    steps = []
    database.connection.set_progress_handler(lambda: steps.append(1) or 0, 1)
    try:
        story.expect_rows(len(database.rows(statement)) == 1)
    finally:
        database.connection.set_progress_handler(None, 0)
    story.expect_rows(len(steps) < 100, database.repeated_work.points().tables['hook_calls'] - initial_reads == 1)


def test_agent_activity_uses_the_non_tick_index(new_story):
    story = new_story(fixture=AgentStarted)
    database = story.container.get(Database)
    plan = database.query_plan(Statement(AGENT_ACTIVITIES_SELECT + " WHERE agents.id = ?", [story.agent.id]))
    story.expect_rows(any("hook_calls_non_tick" in line for line in plan))
