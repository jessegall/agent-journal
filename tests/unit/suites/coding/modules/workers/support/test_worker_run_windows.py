from core.modules.plans.models.phase import Phase
from core.modules.plans.models.plan_task import PlanTask
from core.modules.plans.support.checkpoint_windows import CheckpointWindows
from core.modules.tasks.models.enums.task_state import TaskState
from suites.coding.modules.workers.support.worker_run_window import WorkerRunWindow
from suites.coding.modules.workers.support.worker_run_windows import WorkerRunWindows

CHECKPOINT = Phase(id=1, plan_id=7, creator_id=1, position=1, title="Cart", checkpoint=True)


def windows(*states: TaskState) -> CheckpointWindows:
    places = tuple(PlanTask(task_id=10 + place, plan_id=7, phase_id=1, phase_position=1, checkpoint=True, position=place, state=state, priority=0)
                   for place, state in enumerate(states, start=1))
    return CheckpointWindows(tuple([CHECKPOINT]), places)


def test_a_commit_that_completes_a_window_gives_it():
    matched = WorkerRunWindows.window(windows(TaskState.COMPLETED, TaskState.TESTING, TaskState.TESTING), CHECKPOINT, frozenset({12, 13}))
    assert matched == WorkerRunWindow(7, 1, (12, 13))


def test_a_window_held_by_two_actors_gives_none():
    assert WorkerRunWindows.window(windows(TaskState.TESTING, TaskState.TESTING), CHECKPOINT, frozenset({11})) is None


def test_a_window_with_an_open_task_gives_none():
    assert WorkerRunWindows.window(windows(TaskState.TESTING, TaskState.STARTED), CHECKPOINT, frozenset({11, 12})) is None


def test_a_window_with_nothing_committed_gives_none():
    assert WorkerRunWindows.window(windows(TaskState.COMPLETED), CHECKPOINT, frozenset({11})) is None


def test_a_window_of_two_workers_gets_a_branch_run():
    assert WorkerRunWindows.window(windows(TaskState.TESTING, TaskState.TESTING, TaskState.TESTING), CHECKPOINT, frozenset({11, 12})) is None
