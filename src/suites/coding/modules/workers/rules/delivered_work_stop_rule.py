from engine.cli.row_numbers import RowNumbers
from engine.cli.agent_number import AGENT_MODEL_NAME
from suites.coding.modules.workers.support.worker_nudges import PROOF_CHECK
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.hook_history import HookHistory
from engine.driver.rule_answer import RuleAnswer
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.rules.support.worker_worktrees import WorkerWorktrees
from suites.coding.modules.workers.support.worker_phases import WorkerPhases
from engine.enums.agent_role import AgentRole


class DeliveredWorkStopRule(DriverRule):
    """A main agent that stops while a worker's delivered work waits for its checks is refused once per
    delivery, and always while a proof with no test waits, since nothing else ever moves it. A worker still
    working through a phase has nothing waiting: the end of the phase checks those proofs."""

    name = "workers.delivered-work-at-stop"
    hook = HookEventName.STOP
    drivers = ["coding.main"]
    roles = [AgentRole.MAIN]
    refuses_one_action = "A stop while a worker's delivered work waits for its checks is refused once per delivery"

    def __init__(self, delivered: WorkerWorktrees, proofs: ProofQuery, history: HookHistory, phases: WorkerPhases, numbers: RowNumbers) -> None:
        self.numbers = numbers
        self.delivered, self.proofs, self.hook_history, self.phases = delivered, proofs, history, phases

    def answer(self, hook: AgentHook) -> RuleAnswer:
        for worktree in self.delivered.main_worktrees():
            if self.phases.has_group_flow(worktree):
                continue
            untested = [proof.id for proof in self.proofs.delivered_proofs(worktree.id).filter(test_command="").oldest().all_rows()]
            if untested:
                return RuleAnswer.refused(PROOF_CHECK.nudge(worker=self.numbers.number(AGENT_MODEL_NAME, worktree.session_agent_id), task=worktree.task_id, proofs=', '.join(map(str, untested))))
        refused_at = self.hook_history.last_answer(self.name, hook)
        for worktree in self.delivered.delivered():
            proofs = [proof.id for proof in self.proofs.delivered_proofs(worktree.id).oldest().all_rows()]
            if proofs and (refused_at is None or worktree.updated_at is None or refused_at < worktree.updated_at):
                return RuleAnswer.refused(PROOF_CHECK.nudge(worker=self.numbers.number(AGENT_MODEL_NAME, worktree.session_agent_id), task=worktree.task_id, proofs=', '.join(map(str, proofs))))
        return RuleAnswer.allowed("no delivered proof needs a check at this stop")
