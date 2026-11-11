from engine.query.queries import Queries
from engine.testing.expectations.line_outcome import LineOutcome
from suites.coding.modules.workers.models.proof import Proof
from tests.stories.suites.coding.modules.workers.support.phase_steps import PHASE_DISPATCH, StoryWorker, file_proof_line, start_planned_worker


def holding_worker(new_story, monkeypatch, count: int) -> StoryWorker:
    """A worker sent to phase Build of plan 1, which holds tasks 1, 2 and 3: task 1 is started for it and it
    started the next tasks itself, up to the count."""
    worker = start_planned_worker(new_story, monkeypatch, PHASE_DISPATCH)
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
