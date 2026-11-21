import unittest
from datetime import datetime, timezone

from journal.events.rows.task_edited import TaskEdited
from journal.features.workers.listeners.worker_task_changes import WorkerTaskChanges
from journal.models.proof import Proof
from journal.models.proof_state import ProofState
from journal.models.task import Task

EDITED_AT = 1000.0


class Tasks:
    def find(self, task_id: int) -> Task:
        return Task(id=task_id, brief="one point")

    def holder(self, task: Task) -> None:
        return None


class Proofs:
    def __init__(self, proofs: list[Proof]) -> None:
        self.proofs, self.saved = proofs, []

    def changed_point_proofs(self, task: Task, points: tuple[int, ...]) -> list[Proof]:
        return [proof for proof in self.proofs if proof.point in points]

    def save(self, proof: Proof, actor) -> Proof:
        self.saved.append(proof)
        return proof


def proof(row: int, at: float) -> Proof:
    return Proof(id=row, point=1, state=ProofState.SHOWN, created_at=datetime.fromtimestamp(at, timezone.utc))


class ProofAfterRedelegationTest(unittest.TestCase):
    """A task re-delegated to a new worker has its brief written anew: the edit stales the earlier worker's proofs, never the proof the new worker showed before the edit was handled, which clock-out still counted as missing."""

    def edited(self, proofs: list[Proof]) -> list[Proof]:
        stored = Proofs(proofs)
        listener = WorkerTaskChanges.__new__(WorkerTaskChanges)
        listener.tasks, listener.proofs = Tasks(), stored
        listener.edited(TaskEdited(time=EDITED_AT, task_id=4030, changes=("brief",), points=(1,)))
        return stored.saved

    def test_a_proof_from_before_the_edit_goes_stale(self) -> None:
        saved = self.edited([proof(7000, EDITED_AT - 60)])

        self.assertEqual([ProofState.STALE], [row.state for row in saved])

    def test_a_proof_shown_after_the_edit_stays_shown(self) -> None:
        saved = self.edited([proof(7000, EDITED_AT - 60), proof(7627, EDITED_AT + 5)])

        self.assertEqual([7000], [row.id for row in saved])
