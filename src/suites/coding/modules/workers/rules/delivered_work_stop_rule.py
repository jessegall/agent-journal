from suites.coding.modules.workers.support.worker_nudges import PROOF_CHECK
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.hook_history import HookHistory
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.rule_history_key import RuleHistoryKey
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.rules.support.worker_worktrees import WorkerWorktrees
from core.base.agent_role import AgentRole


class DeliveredWorkStopRule(DriverRule):
    """A main agent that stops while a worker's delivered work waits for its checks is refused once per
    delivery."""

    name = "workers.delivered-work-at-stop"
    hook = HookEventName.STOP
    drivers = ["coding.builder", "coding.orchestrator"]
    roles = [AgentRole.MAIN]

    def __init__(self, delivered: WorkerWorktrees, proofs: ProofQuery, history: HookHistory) -> None:
        self.delivered, self.proofs, self.hook_history = delivered, proofs, history

    def answer(self, hook: AgentHook) -> RuleAnswer:
        refused_at = self.hook_history.answer_time(RuleHistoryKey(hook.agent_id, self.name, hook.layer_ref))
        for worktree in self.delivered.delivered(hook.agent_id):
            proofs = [proof.id for proof in self.proofs.waiting_proofs(worktree.id).oldest().all_rows()]
            if proofs and (refused_at is None or worktree.updated_at is None or refused_at < worktree.updated_at):
                return RuleAnswer.refused(PROOF_CHECK.nudge(worker=worktree.agent_id, task=worktree.task_id, proofs=', '.join(map(str, proofs))))
        return RuleAnswer.allowed()
