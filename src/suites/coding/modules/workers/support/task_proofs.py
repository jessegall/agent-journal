from dataclasses import dataclass

from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.models.enums.proof_state import ProofState
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.support.missing_points import MissingPoints

# A proof in one of these states stands for its point at a commit: a checked proof is never shown a second
# time, and a short proof is refused by name instead of counted as a missing point.
PROVING_STATES = (ProofState.SHOWN, ProofState.CHECKED, ProofState.SHORT)


@dataclass(frozen=True)
class TaskProofs:
    """A started task of a worker and the proofs its worktree has for it."""

    task: Task
    proofs: tuple[Proof, ...]

    def has_shown(self) -> bool:
        return any(proof.state is ProofState.SHOWN for proof in self.proofs)

    def short(self) -> tuple[Proof, ...]:
        return tuple(proof for proof in self.proofs if proof.state is ProofState.SHORT)

    def missing(self) -> MissingPoints:
        return MissingPoints.unproved(self.task, {proof.point for proof in self.proofs if proof.state in PROVING_STATES})

    def is_ready(self) -> bool:
        return not self.missing().points and not self.short()

    def is_incomplete(self) -> bool:
        return self.has_shown() and bool(self.missing().points)

    def is_refused_short(self) -> bool:
        return self.has_shown() and bool(self.short())
