import pytest

from core.modules.drivers.models.support.views import AGENT_ACTIVITIES_SELECT
from engine.database.statement import Statement

MAIN_AGENT_START = "agent start s-1 claude main --environment main"
INSERT_HOOK_CALL = ("INSERT INTO hook_calls (session_agent_id, environment_id, creator_id, hook, event_id, answer, created_at, updated_at)"
                    " VALUES (?, 1, ?, ?, ?, ?, '', '')")


@pytest.mark.parametrize(("condition", "parameters", "index"), [
    ("answer = ?", ["refused"], "hook_calls_refused"),
    ("hook <> 'tick'", (), "hook_calls_non_tick"),
])
def test_latest_matching_hook_reads_one_row_with_an_index(journal, condition, parameters, index):
    agent = journal.new_row_id(MAIN_AGENT_START)
    database = journal.database
    database.connection.executemany(INSERT_HOOK_CALL, [(agent, agent, "tool" if n == 0 else "tick", str(n), "refused" if n == 0 else "allowed") for n in range(1000)])
    statement = Statement(f"SELECT * FROM hook_calls WHERE session_agent_id = ? AND {condition} ORDER BY id DESC LIMIT 1", (agent, *parameters))
    assert any(index in line for line in database.query_plan(statement))
    initial_reads = database.repeated_work.points().tables["hook_calls"]
    steps = []
    database.connection.set_progress_handler(lambda: steps.append(1) or 0, 1)
    try:
        assert len(database.rows(statement)) == 1
    finally:
        database.connection.set_progress_handler(None, 0)
    assert len(steps) < 200 and database.repeated_work.points().tables["hook_calls"] - initial_reads == 1, len(steps)


def test_agent_activity_uses_the_non_tick_index(journal):
    agent = journal.new_row_id(MAIN_AGENT_START)
    plan = journal.database.query_plan(Statement(AGENT_ACTIVITIES_SELECT + " WHERE agents.id = ?", [agent]))
    assert any("hook_calls_non_tick" in line for line in plan)
