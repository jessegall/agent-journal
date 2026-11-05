from core.base.driver.nudge import Nudge
from suites.coding.support.coding_agent_role import CodingAgentRole as AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.rules.support.worker_worktrees import WorkerWorktrees
from suites.coding.modules.workers.support.worker_nudges import WORKER_UNMERGED


class UnmergedWorkerRule(DriverRule):
    """A tick names to the main agent each worker whose delivered work is not merged or released, with its
    tasks, again after the interval of the line."""

    name = "workers.unmerged-worker"
    hook = HookEventName.TICK
    drivers = ["coding.builder", "coding.orchestrator"]
    roles = [AgentRole.MAIN]

    def __init__(self, delivered: WorkerWorktrees, tasks: TaskQuery, proofs: ProofQuery) -> None:
        self.delivered, self.tasks, self.proofs = delivered, tasks, proofs

    def answer(self, hook: AgentHook) -> RuleAnswer:
        nudges: list[Nudge] = []
        for worktree in self.delivered.delivered(hook.agent_id):
            proofs = tuple(self.proofs.waiting_proofs(worktree.id).oldest().all_rows())
            action = f"journal worker merge {worktree.session_agent_id}, or journal worker release {worktree.session_agent_id}"
            if proofs:
                action = f"journal proof check {', '.join(str(proof.id) for proof in proofs)}"
            nudges.append(WORKER_UNMERGED.nudge(worker=worktree.session_agent_id, tasks=self.task_names(worktree.session_agent_id), action=action))
        return RuleAnswer.with_nudges(*nudges)

    def task_names(self, worker_id: int) -> str:
        return ", ".join(f"task:{task.id}" for task in self.tasks.filter(delegated_to=worker_id).unclosed().oldest().all_rows())
