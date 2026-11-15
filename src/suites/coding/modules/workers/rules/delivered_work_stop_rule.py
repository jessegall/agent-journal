from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.hook_history import HookHistory
from engine.driver.rule_answer import RuleAnswer
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.rules.support.worker_worktrees import WorkerWorktrees
from engine.enums.agent_role import AgentRole



from suites.coding.modules.workers.needs.delivered_work_stop_needs import DELIVERED_PROOFS_REASON, DELIVERED_WORK_STOP_KEY, DeliveredWorkStopNeeds


class DeliveredWorkStopRule(DriverRule):
    """The old walk's answer for DeliveredWorkStopNeeds, which owns it: the walk refuses a stop once per delivery, and
    always while a proof with no test waits, until the walk is deleted."""

    name = DELIVERED_WORK_STOP_KEY
    hook = HookEventName.STOP
    drivers = ["coding.main"]
    roles = [AgentRole.MAIN]
    single_action_refusal = "A stop while a worker's delivered work waits for its checks is refused once per delivery"

    def __init__(self, delivered: WorkerWorktrees, proofs: ProofQuery, history: HookHistory, needs: DeliveredWorkStopNeeds) -> None:
        self.delivered, self.proofs, self.hook_history, self.needs = delivered, proofs, history, needs

    def answer(self, hook: AgentHook) -> RuleAnswer:
        for worktree in self.delivered.main_worktrees():
            untested = list(self.proofs.delivered_proofs(worktree.id).filter(test_command="").every_row(DELIVERED_PROOFS_REASON))
            if untested:
                return RuleAnswer.refusals([nudge for _, nudge in self.needs.task_nudges(worktree, untested)])
        refused_at = self.hook_history.last_answer(self.name, hook)
        for worktree in self.delivered.delivered():
            proofs = list(self.proofs.delivered_proofs(worktree.id).every_row(DELIVERED_PROOFS_REASON))
            if proofs and (refused_at is None or worktree.updated_at is None or refused_at < worktree.updated_at):
                return RuleAnswer.refusals([nudge for _, nudge in self.needs.task_nudges(worktree, proofs)])
        return RuleAnswer.allowed("no committed proof needs a check at this stop")
