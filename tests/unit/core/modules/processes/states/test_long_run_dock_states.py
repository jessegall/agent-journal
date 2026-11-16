from types import SimpleNamespace

from engine.agent_machine.states.agent_reference import AgentReference
from engine.agent_machine.record.question import Question
from core.modules.processes.states.long_run_dock_states import TITLE_GRACE_USES, LongRunDockStates

AGENT = AgentReference(4, 1, 1, "main")


def plans(untitled: tuple[int, ...]):
    docking = SimpleNamespace(docked=lambda event, agent_id: SimpleNamespace(untitled=untitled))
    return LongRunDockStates(docking).states([AGENT], Question.none()).get(AGENT.agent_id, [])


def test_a_docked_run_titled_by_its_raw_command_is_held_after_five_uses_until_it_is_titled():
    [plan] = plans(tuple([7]))
    assert (plan.tool_grace_uses, plan.lifting_lines) == (TITLE_GRACE_USES, tuple(["journal output title 7"]))


def test_a_docked_run_with_a_descriptive_title_holds_nothing():
    assert plans(()) == []
