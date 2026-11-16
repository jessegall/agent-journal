from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from collections.abc import Mapping, Sequence

from engine.agent_machine.states.agent_reference import AgentReference
from engine.agent_machine.states.block_plan import BlockPlan
from engine.agent_machine.states.required_state import RequiredState
from engine.agent_machine.states.state_source import StateSource
from engine.agent_machine.record.question import Question
from engine.agent_stack.states.blocked import Blocked
from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.cli.row_numbers import RowNumbers
from engine.driver.agent_message import AgentMessage
from engine.enums.agent_role import AgentRole
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.agent_messages.proof_check_message import ProofCheckMessage
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.support.worker_worktrees import WorkerWorktrees
from suites.coding.modules.workers.support.block_conditions.delivered_proofs_checked import DeliveredProofsChecked

DELIVERED_WORK_STOP_KEY = "workers.delivered-work-at-stop"
DELIVERED_PROOFS_REASON = "the main agent checks every proof a worker delivered"


class DeliveredWorkStopStates(StateSource):
    """The main agent's stop is held while a worker's delivered work, or a committed proof with no test, waits
    for its checks (doc 1310 section 10.5): one hold for each task, naming its proofs, lifted once none of
    that worktree's proofs waits."""
    state_type = Blocked
    rank = "workers.delivered-proofs"
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, delivered: WorkerWorktrees, proofs: ProofQuery, numbers: RowNumbers) -> None:
        self.delivered, self.proofs, self.numbers = delivered, proofs, numbers

    def states(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[RequiredState | BlockPlan]]:
        plans = [plan for worktree in self.delivered.main_worktrees() for plan in self.plans(worktree)]
        return {agent.agent_id: plans for agent in agents} if plans else {}

    # a delivered worktree waits on every proof it delivered; one not delivered yet on the proofs that have no test,
    # which only the main agent's check passes
    def plans(self, worktree: Worktree) -> list[BlockPlan]:
        proofs = [proof for proof in self.proofs.delivered_proofs(worktree.id).every_row(DELIVERED_PROOFS_REASON)
                  if worktree.state is WorktreeState.DELIVERED or not proof.test_command]
        return [BlockPlan(agent_message, DeliveredProofsChecked(worktree.id), DELIVERED_WORK_STOP_KEY, self.rank, members=(task_id,), scope_tools=False, scope_stop=True)
                for task_id, agent_message in self.task_agent_messages(worktree, proofs)]

    def task_agent_messages(self, worktree: Worktree, proofs: list[Proof]) -> list[tuple[int, AgentMessage]]:
        worker = self.numbers.number(AGENT_MODEL_NAME, worktree.session_agent_id)
        return [(task_id, ProofCheckMessage.declared().agent_message(worker=worker, task=task_id, proofs=", ".join(str(proof.id) for proof in proofs if proof.task_id == task_id)))
                for task_id in dict.fromkeys(proof.task_id for proof in proofs)]
