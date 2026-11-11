from dataclasses import dataclass

from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.support.attribution import Attribution


@dataclass(frozen=True)
class FailureAttribution:
    """Says which task of a window a failing test belongs to: the one task whose proof names a failing path in
    its test command. When no proof names one, or the proofs of several tasks do, the failure names no task
    and goes to the task of the window that was completed last."""

    proofs: tuple[Proof, ...]
    last_task_id: int

    def attributed(self, failed_paths: tuple[str, ...]) -> Attribution:
        naming_task_ids = {proof.task_id for proof in self.proofs if any(path in proof.test_command for path in failed_paths)}
        if len(naming_task_ids) == 1:
            return Attribution(next(iter(naming_task_ids)), True)
        return Attribution(self.last_task_id, False)
