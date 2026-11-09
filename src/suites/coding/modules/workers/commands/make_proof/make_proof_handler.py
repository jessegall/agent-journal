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
from suites.coding.modules.workers.support.proof_test_line import ProofTestLine

PIPE_TOKENS = frozenset(("|", "|&", ">", ">>", ">&", "&>", "--tail", "--head", "--cut"))
FIRST_POINT = 1


class MakeProofHandler(Handler[MakeProof, Proof]):
    """Makes the worker's proof for a point, changes its text while it waits for a check, or shows a short one
    again."""

    command = MakeProof

    def __init__(self, worktrees: WorktreeQuery, proofs: ProofQuery, repository: Repository, test_line: ProofTestLine) -> None:
        self.worktrees, self.proofs, self.repository, self.test_line = worktrees, proofs, repository, test_line

    def handle(self, command: MakeProof, context: Context) -> Proof:
        worktree = self.worktrees.worker_worktree(context.actor.id)
        if worktree is None:
            raise Refusal("only a worker with a worktree out makes proofs", "journal worker-worktree list shows the worktrees")
        task_proofs = self.proofs.worktree_proofs(worktree.id).filter(task_id=command.task_id)
        if command.task_id != worktree.task_id and not task_proofs.exists():
            raise Refusal(f"the worker's current task is {worktree.task_id}, not {command.task_id}", "name the task this proof is for")
        if command.point < FIRST_POINT:
            raise Refusal(f"the points of a brief start at {FIRST_POINT}, not {command.point}", f"journal task show {command.task_id} lists them")
        if self.is_piped(command.test_command):
            raise Refusal("a proof's test runs without a pipe, a redirect or a reading flag such as --tail, since the journal reads its whole output", "give the bare test command")
        test_command = self.test_line.resolved(command.test_command, worktree.session_agent_id)
        existing = task_proofs.filter(point=command.point).first()
        if existing is None:
            return self.repository.save(Proof(task_id=command.task_id, worktree_id=worktree.id, creator_id=context.actor.id, point=command.point,
                                              text=command.text, test_command=test_command), context)
        if existing.state is ProofState.SHORT:
            return self.repository.save(existing.revise(context.timestamp, context.actor, command.text, test_command), context)
        if existing.state is ProofState.CHECKED:
            raise Refusal(f"point {command.point} is checked already", "prove the points that are not")
        return self.repository.save(existing.changed(text=command.text, test_command=test_command or existing.test_command), context)

    @staticmethod
    def is_piped(line: str) -> bool:
        tokens = shlex.shlex(line, posix=True, punctuation_chars=True)
        tokens.whitespace_split = True
        try:
            return bool(PIPE_TOKENS & set(tokens))
        except ValueError:
            return False
