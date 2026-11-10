from engine.command.context import Context
from engine.enums.agent_role import AgentRole
from engine.enums.actor_type import ActorType
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.errors.refusal import Refusal
from engine.scope.actor_scope import ActorScope
from core.modules.drivers.support.nudger import Nudger
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.agents.models.agent import Agent
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from suites.coding.modules.workers.commands.short_proof.short_proof import ShortProof
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.models.enums.proof_state import ProofState
from suites.coding.modules.workers.models.lifecycles.proof_lifecycle import ProofLifecycle
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.support.worker_job import SHORT_PROOF_SOURCE
from suites.coding.modules.workers.support.worker_nudges import WORKER_PROOF_SHORT


class ShortProofHandler(Handler[ShortProof, Proof]):
    """Sends a proof back short: the task goes back to its worker, who is told what is missing."""

    command = ShortProof
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, repository: Repository, nudger: Nudger) -> None:
        self.queries, self.repository, self.nudger = queries, repository, nudger

    def handle(self, command: ShortProof, context: Context) -> Proof:
        proof = self.queries.query(Proof).find(command.row_id)
        if proof.state is ProofState.CHECKED:
            if context.actor.type is not ActorType.AGENT or self.queries.query(Agent).find(context.actor.id).role != AgentRole.MAIN:
                raise Refusal("only the main agent can return a checked proof", "ask the main agent to send it back with a reason")
            if not command.shortfall.strip():
                raise Refusal("returning a checked proof needs a reason", "say what is wrong with the proof")
        proof = self.repository.save(proof.moved(ProofLifecycle.short, shortfall=command.shortfall), context)
        worktree = self.queries.query(Worktree).find(proof.worktree_id)
        if worktree.state is WorktreeState.DELIVERED:
            self.repository.save(worktree.moved(WorktreeLifecycle.rework), context)
            task = self.queries.query(Task).find(proof.task_id)
            if task.state is not TaskState.STARTED:
                self.repository.save(task.moved(TaskLifecycle.retest), context)
        self.nudger.send(worktree.session_agent_id, WORKER_PROOF_SHORT, SHORT_PROOF_SOURCE, context, proof=proof.id, task=proof.task_id)
        return proof
