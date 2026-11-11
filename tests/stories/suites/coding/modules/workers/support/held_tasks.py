from engine.query.queries import Queries
from engine.testing.expectations.line_outcome import LineOutcome
from suites.coding.modules.workers.models.proof import Proof
from tests.stories.suites.coding.modules.workers.support.phase_steps import PHASE_DISPATCH, StoryWorker, approve_plan, dispatched_story_worker, file_proof_line, planned_story, unplanned_group_worker, unplanned_worker

# The tasks of phase Build in the order a worker starts them: task 4 is the one task of phase Ship.
BUILD_TASK_IDS = (1, 2, 3, 5, 6, 7)
PLANNED_BUILD_TASK_COUNT = 3
UNPLANNED_PAIR = 2


def holding_worker(new_story, monkeypatch, count: int, build_task_count: int = PLANNED_BUILD_TASK_COUNT, build_test: str = "") -> StoryWorker:
    """A worker sent to phase Build of plan 1, which holds tasks 1, 2 and 3 and, when more are asked for, tasks
    5, 6 and 7: task 1 is started for it and it started the next tasks itself, up to the count."""
    story = planned_story(new_story, approve=False, build_test=build_test)
    for task_id in BUILD_TASK_IDS[PLANNED_BUILD_TASK_COUNT:build_task_count]:
        story.run(f'task make "Build part {task_id}" --phase 1 --environment main')
    approve_plan(story)
    worker = dispatched_story_worker(story, PHASE_DISPATCH, monkeypatch)
    for task_id in BUILD_TASK_IDS[1:count]:
        worker.story.run(f"task start {task_id}", actor=worker.worker)
    return worker


def unplanned_holding_worker(new_story, monkeypatch, count: int = UNPLANNED_PAIR) -> StoryWorker:
    """A worker that holds two or three tasks started, none of them in a plan and none waiting behind them."""
    worker = unplanned_worker(new_story, monkeypatch) if count == UNPLANNED_PAIR else unplanned_group_worker(new_story, monkeypatch)
    for task_id in range(2, count + 1):
        worker.story.run(f"task start {task_id}", actor=worker.worker)
    return worker


def prove_task(worker: StoryWorker, task_id: int, point: int, test_line: str = "") -> LineOutcome:
    """The worker changes a file for the task and shows a proof of one point of it."""
    worker.repository.changed(worker.worker.id, f"task_{task_id}.txt", f"point {point}\n")
    test_flag = f' --test "{file_proof_line(test_line)}"' if test_line else ""
    return worker.story.run(f'proof make {point} --task {task_id} "cart.py:1, the cart total"{test_flag}', actor=worker.worker)


def proofs(worker: StoryWorker) -> tuple[Proof, ...]:
    return tuple(worker.story.container.get(Queries).query(Proof).oldest().all_rows())
