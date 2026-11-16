from types import SimpleNamespace

from engine.agent_machine.states.agent_reference import AgentReference
from engine.agent_machine.record.question import Question
from core.modules.processes.states.long_run_dock_states import TITLE_GRACE_USES, LongRunDockStates

AGENT = AgentReference(4, 1, 1, "main")


def plans(process_ids: tuple[int, ...]):
    requests = SimpleNamespace(open_for_agent=lambda agent_id: tuple(SimpleNamespace(process_id=process_id) for process_id in process_ids))
    return LongRunDockStates(requests).states([AGENT], Question.none()).get(AGENT.agent_id, [])


def test_a_run_with_an_open_title_request_is_held_after_five_uses_until_it_is_titled():
    [plan] = plans((7,))
    assert (plan.tool_grace_uses, plan.lifting_lines) == (TITLE_GRACE_USES, ("journal output title 7",))


def test_no_open_title_request_holds_nothing():
    assert plans(()) == []
