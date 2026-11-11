from engine.enums.actor_count import ActorCount
from engine.model.assignable import Assignable
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task

ACTOR_ID = 7
SECOND_ACTOR_ID = 8


def task(state: TaskState, holder_id: int | None = None) -> Task:
    return Task(creator_id=1, title="Fix the cart", state=state, holder_id=holder_id)


def test_task_is_assignable_for_one_actor():
    assert issubclass(Task, Assignable) and Task.takes_actors is ActorCount.SINGLE


def test_a_closed_task_is_skipped_by_a_cascade():
    assert task(TaskState.COMPLETED).cascade_skips(ACTOR_ID) and task(TaskState.CANCELLED).cascade_skips(ACTOR_ID)


def test_a_started_task_held_by_another_actor_is_skipped():
    assert task(TaskState.STARTED, SECOND_ACTOR_ID).cascade_skips(ACTOR_ID) and task(TaskState.TESTING, SECOND_ACTOR_ID).cascade_skips(ACTOR_ID)


def test_a_started_task_held_by_the_actor_is_not_skipped():
    assert not task(TaskState.STARTED, ACTOR_ID).cascade_skips(ACTOR_ID)


def test_an_open_or_blocked_unheld_task_is_not_skipped():
    assert not task(TaskState.OPEN).cascade_skips(ACTOR_ID) and not task(TaskState.BLOCKED).cascade_skips(ACTOR_ID)
