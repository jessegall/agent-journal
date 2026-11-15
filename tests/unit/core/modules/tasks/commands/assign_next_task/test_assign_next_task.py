from types import SimpleNamespace

from core.modules.tasks.commands.assign_next_task.assign_next_task import AssignNextTask
from core.modules.tasks.commands.assign_next_task.assign_next_task_handler import AssignNextTaskHandler
from core.modules.tasks.commands.start_task.start_task import StartTask

MAIN = SimpleNamespace(id=4, role="main", ended_at=None)
URGENT, FOLLOWING = SimpleNamespace(id=9), SimpleNamespace(id=7)


class Bus:
    def __init__(self):
        self.dispatched = []

    def dispatch(self, command, context):
        self.dispatched.append(command)


def assigned(agent=MAIN, held=(), automatic=True, past_limit=False) -> list:
    assigner = SimpleNamespace(is_automatic=lambda: automatic, exceeds_context_limit=lambda agent_id: past_limit, urgent=lambda: URGENT, following=lambda agent_id: FOLLOWING)
    bus = Bus()
    AssignNextTaskHandler(SimpleNamespace(find=lambda agent_id: agent, is_main=lambda agent_id: agent.role == "main"), SimpleNamespace(started_tasks=lambda agent_id: list(held)),
                          SimpleNamespace(assigner=lambda: assigner), bus).handle(AssignNextTask(agent.id), SimpleNamespace())
    return bus.dispatched


def test_an_agent_with_no_task_in_hand_starts_the_one_the_assigner_gives_next():
    assert assigned() == [StartTask(FOLLOWING.id)]


def test_an_agent_with_tasks_in_hand_starts_only_an_urgent_one():
    assert assigned(held=[SimpleNamespace(id=1)]) == [StartTask(URGENT.id)]


def test_nothing_starts_outside_auto_mode_past_the_context_limit_or_for_an_ended_agent():
    assert assigned(automatic=False) == []
    assert assigned(past_limit=True) == []
    assert assigned(agent=SimpleNamespace(id=4, role="main", ended_at="earlier")) == []
