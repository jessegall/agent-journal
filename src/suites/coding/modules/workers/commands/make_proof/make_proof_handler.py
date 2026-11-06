import shlex

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from suites.coding.modules.workers.commands.make_proof.make_proof import MakeProof
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.models.enums.proof_state import ProofState
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery

PIPE_TOKENS = frozenset(("|", "|&", ">", ">>", ">&", "&>", "--tail", "--head", "--cut"))


class MakeProofHandler(Handler[MakeProof, Proof]):
    """Makes the worker's proof for a point, changes its text while it waits for a check, or shows a short one
    again."""

    command = MakeProof

    def __init__(self, worktrees: WorktreeQuery, proofs: ProofQuery, repository: Repository) -> None:
        self.worktrees, self.proofs, self.repository = worktrees, proofs, repository

    def handle(self, command: MakeProof, context: Context) -> Proof:
        worktree = self.worktrees.worker_worktree(context.actor.id)
        if worktree is None:
            raise Refusal("only a worker with a worktree out makes proofs", "journal worker-worktree list shows the worktrees")
        if self.is_piped(command.test_command):
            raise Refusal("a proof's test runs without a pipe, a redirect or a reading flag such as --tail, since the journal reads its whole output", "give the bare test command")
        existing = self.proofs.worktree_proofs(worktree.id).filter(point=command.point, task_id=worktree.task_id).first()
        if existing is None:
            return self.repository.save(Proof(task_id=worktree.task_id, worktree_id=worktree.id, creator_id=context.actor.id, point=command.point,
                                              text=command.text, test_command=command.test_command), context)
        if existing.state is ProofState.SHORT:
            return self.repository.save(existing.revise(context.timestamp, context.actor, command.text, command.test_command), context)
        if existing.state is ProofState.CHECKED:
            raise Refusal(f"point {command.point} is checked already", "prove the points that are not")
        return self.repository.save(existing.changed(text=command.text, test_command=command.test_command or existing.test_command), context)

    @staticmethod
    def is_piped(line: str) -> bool:
        tokens = shlex.shlex(line, posix=True, punctuation_chars=True)
        tokens.whitespace_split = True
        try:
            return bool(PIPE_TOKENS & set(tokens))
        except ValueError:
            return False
