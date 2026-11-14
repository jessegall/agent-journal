import shlex

from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.listener.rows.event_rows import EventRows
from engine.repository.repository import Repository
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.commands.make_proof.make_proof import MakeProof
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.models.enums.proof_state import ProofState
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.proof_test_line import ProofTestLine
from suites.coding.modules.workers.support.worker_task_access import WorkerTaskAccess

PIPE_TOKENS = frozenset(("|", "|&", ">", ">>", ">&", "&>", "--tail", "--head", "--cut"))
FIRST_POINT = 1


class MakeProofHandler(Handler[MakeProof, Proof]):
    """Makes the worker's proof for a point, changes its text while it waits for a check, or shows a short one
    again."""

    command = MakeProof

    def __init__(self, worktrees: WorktreeQuery, proofs: ProofQuery, repository: Repository, test_line: ProofTestLine, rows: EventRows, access: WorkerTaskAccess) -> None:
        self.worktrees, self.proofs, self.repository, self.test_line = worktrees, proofs, repository, test_line
        self.rows, self.access = rows, access

    def handle(self, command: MakeProof, context: Context) -> Proof:
        worktree = self.worktrees.worker_worktree(context.actor.id)
        if worktree is None:
            raise Refusal("only a worker with a worktree out makes proofs", "journal worker-worktree list shows the worktrees")
        task_proofs = self.proofs.worktree_proofs(worktree.id).filter(task_id=command.task_id)
        task = self.rows.required(Task, command.task_id)
        if self.access.has_foreign_holder(task, context.actor.id) or not self.access.is_holder(task, context.actor.id) and not task_proofs.exists():
            raise self.access.refusal(task, context.actor.id)
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
