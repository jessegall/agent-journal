import unittest

from journal.features.workers.support.worker_actions import WorkerActions
from journal.models.proof import Proof
from journal.models.proof_state import ProofState
from journal.models.task import Task
from journal.models.worker import Worker
from journal.support.rejection import Rejection


class Tasks:
    def __init__(self, finished: tuple[int, ...], holding: tuple[int, ...]) -> None:
        self.finished, self.holding = finished, holding

    def finished_task_ids(self, ref) -> tuple[int, ...]:
        return self.finished

    def holder_task_ids(self, ref) -> tuple[int, ...]:
        return self.holding

    def find(self, task_id: int) -> Task:
        return Task(id=task_id, brief="one point")


class Proofs:
    def __init__(self, proofs: dict[int, tuple[Proof, ...]]) -> None:
        self.proofs = proofs

    def task_proofs(self, task: Task) -> tuple[Proof, ...]:
        return self.proofs.get(task.id, ())


def actions(finished: tuple[int, ...], holding: tuple[int, ...], proofs: dict[int, tuple[Proof, ...]]) -> WorkerActions:
    built = WorkerActions.__new__(WorkerActions)
    built.tasks, built.proofs = Tasks(finished, holding), Proofs(proofs)
    return built


def proof(row: int, state: ProofState = ProofState.SHOWN) -> Proof:
    return Proof(id=row, point=1, state=state)


class WorkerCheckTaskTest(unittest.TestCase):
    """A check without --task checks the task whose proof waits, not the task the worker was handed next, as worker 2558's check of task 3975 marked task 3973; with fresh proofs on more than one task it names them instead, as worker 2548's checks needed."""

    def test_a_check_targets_the_proved_task_over_the_next_one(self) -> None:
        worker = Worker(id=2558)

        task = actions((3975,), (3973,), {3975: (proof(1),)}).checked_task(worker, 0)

        self.assertEqual(3975, task.id)

    def test_a_check_refuses_and_lists_the_tasks_when_two_have_fresh_proofs(self) -> None:
        worker = Worker(id=2548)

        with self.assertRaises(Rejection) as refused:
            actions((3964,), (3966,), {3964: (proof(1),), 3966: (proof(2, ProofState.UNFINISHED),)}).checked_task(worker, 0)

        self.assertIn("journal worker check 2548 <point> --task 3964", str(refused.exception))
        self.assertIn("journal worker check 2548 <point> --task 3966", str(refused.exception))

    def test_a_checked_task_is_no_longer_a_candidate(self) -> None:
        worker = Worker(id=2548)

        task = actions((3964,), (3966,), {3964: (proof(1, ProofState.CHECKED),), 3966: (proof(2),)}).checked_task(worker, 0)

        self.assertEqual(3966, task.id)

    def test_without_fresh_proofs_the_current_task_is_checked(self) -> None:
        self.assertEqual(3973, actions((), (3973,), {}).checked_task(Worker(id=2558), 0).id)

    def test_a_named_task_is_checked_as_named(self) -> None:
        self.assertEqual(3973, actions((3975,), (3973,), {3975: (proof(1),)}).checked_task(Worker(id=2558), 3973).id)
