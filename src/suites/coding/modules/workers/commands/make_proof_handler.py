from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from suites.coding.modules.workers.commands.make_proof import MakeProof
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.models.enums.proof_state import ProofState
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery


class MakeProofHandler(Handler[MakeProof, Proof]):
    """Makes the worker's proof for a point, changes its text while it waits for a check, or shows a short one again."""

    command = MakeProof

    def __init__(self, worktrees: WorktreeQuery, proofs: ProofQuery, repository: Repository) -> None:
        self.worktrees, self.proofs, self.repository = worktrees, proofs, repository

    def handle(self, command: MakeProof, context: Context) -> Proof:
        worktree = self.worktrees.worker_worktree(context.actor.id)
        if worktree is None:
            raise Refusal("only a worker with a worktree out makes proofs", "journal worker-worktree list shows the worktrees")
        rows = self.proofs.worktree_proofs(worktree.id).filter(point=command.point).page(1, 1).rows
        if not rows:
            return self.repository.save(Proof(task_id=worktree.task_id, worktree_id=worktree.id, creator_id=context.actor.id, point=command.point,
                                              text=command.text), context)
        if rows[0].state is ProofState.SHORT:
            return self.repository.save(rows[0].revise(context.timestamp, context.actor, command.text), context)
        if rows[0].state is ProofState.CHECKED:
            raise Refusal(f"point {command.point} is checked already", "prove the points that are not")
        return self.repository.save(rows[0].changed(text=command.text), context)
