from suites.coding.modules.workers.support.worker_nudges import PROOF_CHECK
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.hook_history import HookHistory
from core.base.driver.rule_answer import RuleAnswer
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.rules.support.worker_worktrees import WorkerWorktrees
from suites.coding.support.coding_agent_role import CodingAgentRole as AgentRole


class DeliveredWorkStopRule(DriverRule):
    """A main agent that stops while a worker's delivered work waits for its checks is refused once per
    delivery, and always while a proof with no test waits, since nothing else ever moves it."""

    name = "workers.delivered-work-at-stop"
    hook = HookEventName.STOP
    drivers = ["coding.builder", "coding.orchestrator"]
    roles = [AgentRole.MAIN]

    def __init__(self, delivered: WorkerWorktrees, proofs: ProofQuery, history: HookHistory) -> None:
        self.delivered, self.proofs, self.hook_history = delivered, proofs, history

    def answer(self, hook: AgentHook) -> RuleAnswer:
        for worktree in self.delivered.main_worktrees(hook.agent_id):
            untested = [proof.id for proof in self.proofs.untested_proofs(worktree.id).oldest().all_rows()]
            if untested:
                return RuleAnswer.refused(PROOF_CHECK.nudge(worker=worktree.session_agent_id, task=worktree.task_id, proofs=', '.join(map(str, untested))))
        refused_at = self.hook_history.last_answer(self.name, hook)
        for worktree in self.delivered.delivered(hook.agent_id):
            proofs = [proof.id for proof in self.proofs.waiting_proofs(worktree.id).oldest().all_rows()]
            if proofs and (refused_at is None or worktree.updated_at is None or refused_at < worktree.updated_at):
                return RuleAnswer.refused(PROOF_CHECK.nudge(worker=worktree.session_agent_id, task=worktree.task_id, proofs=', '.join(map(str, proofs))))
        return RuleAnswer.allowed()
