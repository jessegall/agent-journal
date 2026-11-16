from types import SimpleNamespace

from engine.agent_stack.row_reference import RowReference
from engine.enums.state_end import StateEnd
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.states.task_work_states import TaskWorkStates


def ends(*tasks: SimpleNamespace):
    listed = SimpleNamespace(listed_tasks=lambda task_ids: tuple(tasks))
    return TaskWorkStates(None, None, None, None, None, None, listed).ends([RowReference("task", task.id) for task in tasks])


def test_a_completed_task_ends_its_stacked_state_closed_and_a_cancelled_one_cancelled():
    assert ends(SimpleNamespace(id=1, state=TaskState.COMPLETED), SimpleNamespace(id=2, state=TaskState.CANCELLED)) == {
        RowReference("task", 1): StateEnd.CLOSED, RowReference("task", 2): StateEnd.CANCELLED}
