from engine.cli.row_numbers import RowNumbers
from engine.cli.agent_number import AGENT_MODEL_NAME
from suites.coding.modules.workers.support.worker_nudges import PROOF_CHECK
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.hook_history import HookHistory
from engine.driver.nudge import Nudge
from engine.driver.rule_answer import RuleAnswer
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.rules.support.worker_worktrees import WorkerWorktrees
from engine.enums.agent_role import AgentRole

DELIVERED_PROOFS_REASON = "the main agent checks every proof a worker delivered"


class DeliveredWorkStopRule(DriverRule):
    """A main agent that stops while a worker's delivered work waits for its checks is refused once per
    delivery, and always while a proof with no test waits, since nothing else ever moves it."""

    name = "workers.delivered-work-at-stop"
    hook = HookEventName.STOP
    drivers = ["coding.main"]
    roles = [AgentRole.MAIN]
    single_action_refusal = "A stop while a worker's delivered work waits for its checks is refused once per delivery"

    def __init__(self, delivered: WorkerWorktrees, proofs: ProofQuery, history: HookHistory, numbers: RowNumbers) -> None:
        self.numbers = numbers
        self.delivered, self.proofs, self.hook_history = delivered, proofs, history

    def answer(self, hook: AgentHook) -> RuleAnswer:
        for worktree in self.delivered.main_worktrees():
            untested = list(self.proofs.delivered_proofs(worktree.id).filter(test_command="").every_row(DELIVERED_PROOFS_REASON))
            if untested:
                return RuleAnswer.refused_for_each(self.nudges(worktree, untested))
        refused_at = self.hook_history.last_answer(self.name, hook)
        for worktree in self.delivered.delivered():
            proofs = list(self.proofs.delivered_proofs(worktree.id).every_row(DELIVERED_PROOFS_REASON))
            if proofs and (refused_at is None or worktree.updated_at is None or refused_at < worktree.updated_at):
                return RuleAnswer.refused_for_each(self.nudges(worktree, proofs))
        return RuleAnswer.allowed("no committed proof needs a check at this stop")

    def nudges(self, worktree: Worktree, proofs: list[Proof]) -> list[Nudge]:
        worker = self.numbers.number(AGENT_MODEL_NAME, worktree.session_agent_id)
        return [PROOF_CHECK.nudge(worker=worker, task=task_id, proofs=", ".join(str(proof.id) for proof in proofs if proof.task_id == task_id)) for task_id in dict.fromkeys(proof.task_id for proof in proofs)]
