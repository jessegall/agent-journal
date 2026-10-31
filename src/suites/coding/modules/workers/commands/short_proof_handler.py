from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from suites.coding.modules.workers.commands.short_proof import ShortProof
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.models.lifecycles.proof_lifecycle import ProofLifecycle
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState

SOURCE = "workers.short-proof"


class ShortProofHandler(Handler[ShortProof, Proof]):
    """Sends a proof back short: the task goes back to its worker, who is told what is missing."""

    command = ShortProof

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: ShortProof, context: Context) -> Proof:
        proof = self.repository.save(self.queries.query(Proof).find(command.row_id).moved(ProofLifecycle.short, shortfall=command.shortfall), context)
        worktree = self.queries.query(Worktree).find(proof.worktree_id)
        if worktree.state is WorktreeState.DELIVERED:
            self.repository.save(worktree.moved(WorktreeLifecycle.rework), context)
            self.repository.save(self.queries.query(Task).find(proof.task_id).moved(TaskLifecycle.retest), context)
        line = (f"point {proof.point} of task {proof.task_id} is short: {command.shortfall}. Fix it, show it again with journal proof make {proof.point}"
                f" \"<text>\" and deliver again with journal worker deliver")
        self.repository.save(AgentLine(agent_id=worktree.agent_id, creator_id=context.actor.id, text=line, source=SOURCE), context)
        return proof
