from collections.abc import Sequence
from dataclasses import dataclass

from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.models.enums.proof_state import ProofState
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.support.missing_points import MissingPoints

# A proof in one of these states proves its point at a commit: a checked proof is never shown a second time.
PROVING_STATES = (ProofState.SHOWN, ProofState.CHECKED)


@dataclass(frozen=True)
class Staging:
    """What a commit of a worker would take: the tasks with a shown proof whose every point is proved, the
    tasks with a shown proof that miss points, and the started tasks with no shown proof."""

    ready: tuple[Task, ...]
    incomplete: tuple[MissingPoints, ...]
    unproved: tuple[Task, ...]

    @classmethod
    def grouped(cls, tasks: Sequence[Task], proofs: Sequence[Proof]) -> "Staging":
        shown_task_ids = {proof.task_id for proof in proofs if proof.state is ProofState.SHOWN}
        missing = [MissingPoints.unproved(task, {proof.point for proof in proofs if proof.task_id == task.id and proof.state in PROVING_STATES})
                   for task in tasks if task.id in shown_task_ids]
        return cls(tuple(entry.task for entry in missing if not entry.points), tuple(entry for entry in missing if entry.points),
                   tuple(task for task in tasks if task.id not in shown_task_ids))

    def is_final(self) -> bool:
        return not self.unproved and not self.incomplete

    def missing_text(self) -> str:
        return "; ".join(entry.text() for entry in self.incomplete)
