from dataclasses import dataclass

from suites.coding.modules.workers.models.proof import Proof


@dataclass(frozen=True)
class WaitingProofs:
    """The proofs of a worktree that wait for its next commit."""

    proofs: tuple[Proof, ...]

    def text(self) -> str:
        if not self.proofs:
            return "registered; no proof is staged"
        task_ids = sorted({proof.task_id for proof in self.proofs})
        proof_count_text = "1 proof is" if len(self.proofs) == 1 else f"{len(self.proofs)} proofs are"
        task_word = "task" if len(task_ids) == 1 else "tasks"
        return f"registered; {proof_count_text} staged for {task_word} {', '.join(str(task_id) for task_id in task_ids)}"
