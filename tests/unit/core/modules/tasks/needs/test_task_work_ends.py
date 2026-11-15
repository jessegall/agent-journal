from types import SimpleNamespace

from engine.agent_stack.subject_reference import SubjectReference
from engine.enums.frame_end import FrameEnd
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.needs.task_work_needs import TaskWorkNeeds


def ends(*tasks: SimpleNamespace):
    named = SimpleNamespace(named_tasks=lambda task_ids: tuple(tasks))
    return TaskWorkNeeds(None, None, None, None, None, None, named).ends([SubjectReference("task", task.id) for task in tasks])


def test_a_completed_task_ends_its_frame_closed_and_a_cancelled_one_cancelled():
    assert ends(SimpleNamespace(id=1, state=TaskState.COMPLETED), SimpleNamespace(id=2, state=TaskState.CANCELLED)) == {
        SubjectReference("task", 1): FrameEnd.CLOSED, SubjectReference("task", 2): FrameEnd.CANCELLED}
