import pytest

from core.modules.plans.models.phase import Phase
from core.modules.plans.models.plan_task import PlanTask
from core.modules.plans.support.checkpoint_windows import CheckpointWindows
from core.modules.tasks.models.enums.task_state import TaskState


def phase(number: int, checkpoint: bool = False) -> Phase:
    return Phase(id=number, plan_id=1, creator_id=1, position=number, title=f"Phase {number}", checkpoint=checkpoint)


def place(task_id: int, phase_number: int, state: TaskState = TaskState.OPEN) -> PlanTask:
    return PlanTask(task_id=task_id, plan_id=1, phase_id=phase_number, phase_position=phase_number, checkpoint=False, position=task_id, state=state, priority=0)


def windows(flagged: tuple[int, ...], phase_count: int = 5) -> CheckpointWindows:
    phases = tuple(phase(number, number in flagged) for number in range(1, phase_count + 1))
    return CheckpointWindows(phases, tuple(place(number, number) for number in range(1, phase_count + 1)))


def window_ids(plan: CheckpointWindows) -> dict[int, tuple[int, ...]]:
    return {checkpoint.id: tuple(task.task_id for task in plan.window(checkpoint)) for checkpoint in plan.checkpoint_phases()}


@pytest.mark.parametrize("flagged, expected", [
    ((), {5: (1, 2, 3, 4, 5)}),
    (tuple([3]), {3: (1, 2, 3), 5: (4, 5)}),
    ((2, 3), {2: (1, 2), 3: tuple([3]), 5: (4, 5)}),
    (tuple([5]), {5: (1, 2, 3, 4, 5)}),
])
def test_the_checkpoints_are_the_flagged_phases_and_the_last_phase_and_each_window_starts_after_the_checkpoint_before_it(flagged, expected):
    assert window_ids(windows(flagged)) == expected


def test_a_phase_that_is_no_checkpoint_belongs_to_the_window_of_the_next_checkpoint():
    plan = windows(tuple([3]))
    assert [plan.window_checkpoint(number).id for number in range(1, 6)] == [3, 3, 3, 5, 5]


def test_a_window_lists_its_tasks_in_the_order_of_their_phases_and_places():
    phases = (phase(1), phase(2, True))
    plan = CheckpointWindows(phases, (place(9, 2), place(4, 1), place(7, 1), place(2, 2)))
    assert tuple(task.task_id for task in plan.window(phases[1])) == (4, 7, 2, 9)


@pytest.mark.parametrize("passed_phase_ids, expected", [((), False), (tuple([3]), False), (tuple([5]), True), ((3, 5), True)])
def test_a_plan_is_over_only_once_the_checkpoint_of_its_last_phase_has_passed(passed_phase_ids, expected):
    assert windows(tuple([3])).is_end_passed(frozenset(passed_phase_ids)) is expected


def test_a_plan_with_no_phase_has_no_checkpoint_to_wait_for():
    assert CheckpointWindows((), ()).is_end_passed(frozenset()) is True
