from argparse import Namespace

from core.base.caller.caller import Caller
from engine.errors.refusal import Refusal
from suites.coding.modules.workers.commands.make_proof.make_proof import MakeProof
from suites.coding.modules.workers.commands.make_proof.make_proof_subcommand import MakeProofSubcommand
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery


class EditProofSubcommand(MakeProofSubcommand):
    """Edit a worker's proof by its ID."""

    name = "edit"

    def __init__(self, proofs: ProofQuery, worktrees: WorktreeQuery) -> None:
        self.proofs, self.worktrees = proofs, worktrees

    def command(self, arguments: Namespace, caller: Caller) -> MakeProof:
        worktree = self.worktrees.worker_worktree(caller.actor.id)
        if worktree is None:
            raise Refusal("only a worker with a worktree out makes proofs", "journal worker-worktree list shows the worktrees")
        proof = self.proofs.worktree_proofs(worktree.id).filter(task_id=worktree.task_id).find(arguments.point)
        return MakeProof(proof.point, arguments.text, arguments.task, arguments.test)
