import pytest

from core.modules.plans.models.checkpoint_reach import CheckpointReach
from core.modules.plans.models.phase import Phase
from core.modules.plans.models.plan_task import PlanTask
from core.modules.plans.support.checkpoint_windows import CheckpointWindows
from core.modules.tasks.models.enums.task_state import TaskState

CHECKPOINT = Phase(id=1, plan_id=1, creator_id=1, position=1, title="Build", checkpoint=True)


def plan(*states: TaskState) -> CheckpointWindows:
    places = tuple(PlanTask(task_id=number, plan_id=1, phase_id=1, phase_position=1, checkpoint=True, position=number, state=state, priority=0)
                   for number, state in enumerate(states, 1))
    return CheckpointWindows(tuple([CHECKPOINT]), places)


@pytest.mark.parametrize("states, reached", [
    ((TaskState.COMPLETED, TaskState.COMPLETED), True),
    ((TaskState.COMPLETED, TaskState.CANCELLED), True),
    ((), True),
    ((TaskState.COMPLETED, TaskState.OPEN), False),
    ((TaskState.COMPLETED, TaskState.STARTED), False),
    ((TaskState.COMPLETED, TaskState.BLOCKED), False),
    ((TaskState.COMPLETED, TaskState.TESTING), False),
])
def test_a_window_is_reached_when_every_task_is_completed_or_cancelled(states, reached):
    assert plan(*states).is_reached(CHECKPOINT) is reached


def test_the_run_of_a_reach_has_the_completed_tasks_and_not_the_cancelled_or_the_unfinished_ones():
    window = plan(TaskState.COMPLETED, TaskState.CANCELLED, TaskState.STARTED, TaskState.COMPLETED)
    assert (window.completed_ids(CHECKPOINT), window.unfinished_ids(CHECKPOINT)) == ((1, 4), tuple([3]))


def test_a_reach_keeps_the_tasks_it_started_with_when_a_task_is_added_to_the_window_later():
    reach = CheckpointReach.started(1, 1, 1, plan(TaskState.COMPLETED, TaskState.COMPLETED).completed_ids(CHECKPOINT))
    later = plan(TaskState.COMPLETED, TaskState.COMPLETED, TaskState.COMPLETED)
    assert (reach.tasks(), later.completed_ids(CHECKPOINT)) == ((1, 2), (1, 2, 3))
