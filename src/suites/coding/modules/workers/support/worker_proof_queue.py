from core.base.command.context import Context
from core.base.repository.repository import Repository
from suites.coding.modules.workers.models.enums.proof_state import ProofState
from suites.coding.modules.workers.models.lifecycles.proof_lifecycle import ProofLifecycle
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.proof_query import ProofQuery


class WorkerProofQueue:
    """Queues the test of every proof of a worktree that has not passed, and says how many it queued."""

    def __init__(self, proofs: ProofQuery, repository: Repository) -> None:
        self.proofs, self.repository = proofs, repository

    def queue(self, worktree: Worktree, context: Context) -> int:
        queued_count = 0
        for proof in tuple(self.proofs.worktree_proofs(worktree.id).oldest().all_rows()):
            if not proof.test_command:
                continue
            if proof.state is ProofState.SHORT:
                proof = self.repository.save(proof.revise(context.timestamp, context.actor, proof.text), context)
            if proof.state is ProofState.SHOWN:
                self.repository.save(proof.moved(ProofLifecycle.queue), context)
                queued_count += 1
        return queued_count
