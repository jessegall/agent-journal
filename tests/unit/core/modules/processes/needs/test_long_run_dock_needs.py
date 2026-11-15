from types import SimpleNamespace

from engine.agent_machine.needs.agent_reference import AgentReference
from engine.agent_machine.record.question import Question
from core.modules.processes.needs.long_run_dock_needs import TITLE_GRACE_USES, LongRunDockNeeds

AGENT = AgentReference(4, 1, 1, "main")
RUN = SimpleNamespace(id=7, line="make test")


def plans(title: str):
    processes = SimpleNamespace(agent=lambda agent_id: SimpleNamespace(running=lambda: SimpleNamespace(docked_runs=lambda: SimpleNamespace(get=lambda: [RUN]))))
    outputs = SimpleNamespace(matching=lambda condition: SimpleNamespace(every_row=lambda reason: [SimpleNamespace(process_id=7, title=title)]))
    return LongRunDockNeeds(processes, outputs).needs([AGENT], Question.none()).get(AGENT.agent_id, [])


def test_a_docked_run_titled_by_its_raw_command_is_held_after_five_uses_until_it_is_titled():
    [plan] = plans("make test")
    assert (plan.tool_grace_uses, plan.lifting_lines) == (TITLE_GRACE_USES, tuple(["journal output title 7"]))


def test_a_docked_run_with_a_descriptive_title_holds_nothing():
    assert plans("The cart unit tests") == []
