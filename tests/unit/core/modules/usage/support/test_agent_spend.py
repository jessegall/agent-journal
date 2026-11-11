from types import SimpleNamespace

from core.modules.usage.support.agent_spend import AgentSpend
from core.modules.usage.support.session_cost import SessionCost

AGENT_ID = 7
AGENT_WITHOUT_HISTORY_ID = 9
SESSIONS = {AGENT_ID: [SimpleNamespace(session="s-codex", program="codex"), SimpleNamespace(session="s-claude", program="claude")], AGENT_WITHOUT_HISTORY_ID: []}
REPORTED_DOLLARS = {"s-codex": 0.25, "s-claude": 1.5}


def session_costs(reported_dollars: dict[str, float], agent_id: int = AGENT_ID) -> tuple[SessionCost, ...]:
    files = SimpleNamespace(status=lambda session: SimpleNamespace(cost_dollars=reported_dollars.get(session)))
    sessions = SimpleNamespace(newest_sessions=lambda session_agent_id, limit: SESSIONS[session_agent_id][:limit])
    return AgentSpend(sessions, files).session_costs(agent_id)


def test_two_sessions_on_two_programs_are_two_costs_each_with_its_program():
    costs = session_costs(REPORTED_DOLLARS)
    assert costs == (SessionCost("s-codex", "codex", 0.25), SessionCost("s-claude", "claude", 1.5))
    assert sum(cost.dollars for cost in costs) == 1.75


def test_a_session_with_no_status_file_reports_no_cost_and_an_agent_with_no_history_has_no_costs():
    assert [cost.dollars for cost in session_costs({"s-claude": 1.5})] == [None, 1.5]
    assert session_costs(REPORTED_DOLLARS, AGENT_WITHOUT_HISTORY_ID) == ()
