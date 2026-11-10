from types import SimpleNamespace

from core.modules.usage.support.agent_spend import AgentSpend
from core.modules.usage.support.session_cost import SessionCost

AGENT_ID = 7
SESSIONS = {AGENT_ID: [SimpleNamespace(session="s-codex", program="codex"), SimpleNamespace(session="s-claude", program="claude")], 9: []}
REPORTED_DOLLARS = {"s-codex": 0.25, "s-claude": 1.5}


def session_costs(reported_dollars: dict[str, float]) -> dict[int, tuple[SessionCost, ...]]:
    files = SimpleNamespace(status=lambda session: SimpleNamespace(cost_dollars=reported_dollars.get(session)))
    sessions = SimpleNamespace(sessions_by_agent=lambda agent_ids: {agent_id: SESSIONS[agent_id] for agent_id in agent_ids})
    return AgentSpend(sessions, files).session_costs([AGENT_ID, 9])


def test_two_sessions_on_two_programs_are_two_costs_each_with_its_program():
    costs = session_costs(REPORTED_DOLLARS)
    assert costs[AGENT_ID] == (SessionCost("s-codex", "codex", 0.25), SessionCost("s-claude", "claude", 1.5))
    assert sum(cost.dollars for cost in costs[AGENT_ID]) == 1.75


def test_a_session_with_no_status_file_costs_nothing_and_an_agent_with_no_history_has_no_costs():
    costs = session_costs({"s-claude": 1.5})
    assert [cost.dollars for cost in costs[AGENT_ID]] == [0.0, 1.5]
    assert costs[9] == ()
