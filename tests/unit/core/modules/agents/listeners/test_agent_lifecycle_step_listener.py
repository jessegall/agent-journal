from types import SimpleNamespace

from core.modules.agents.listeners.agent_lifecycle_step_listener import LIFECYCLE_FIELDS, AgentLifecycleStepListener

ROW_FIELDS = {"id": 7, "parent_id": 3, "given_name": "Ada", **dict.fromkeys(LIFECYCLE_FIELDS)}


def agents(**changes: object) -> tuple[int, ...]:
    listener = AgentLifecycleStepListener(SimpleNamespace())
    return tuple(listener.agents(SimpleNamespace(row=SimpleNamespace(**{**ROW_FIELDS, **changes}), old_row=SimpleNamespace(**ROW_FIELDS))))


def test_an_ended_agent_asks_for_its_own_step_and_its_parents():
    assert agents(ended_at="now") == (7, 3)


def test_a_new_process_asks_for_the_agents_step_alone():
    assert agents(pid=42) == (7,)


def test_a_change_of_no_lifecycle_fact_asks_for_nothing():
    assert agents(given_name="Grace") == ()
