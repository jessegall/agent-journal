from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.processes.commands.orphan_process.orphan_process import OrphanProcess
from core.modules.processes.queries.process_query import ProcessQuery


class LeftoverRunRule(DriverRule):
    """When an agent's program starts anew, every run still open from before is marked orphaned, which kills
    it; a start after a compaction or a clear is the same program, whose runs go on."""

    name = "processes.leftover-runs"
    hook = HookEventName.SESSION_START
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.WORKER]

    def __init__(self, processes: ProcessQuery) -> None:
        self.processes = processes

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if hook.event.is_continuing:
            return RuleAnswer.allowed()
        leftover_runs = self.processes.agent(hook.agent_id).running().oldest().all_rows()
        return RuleAnswer.allowed().running(*(OrphanProcess(process.id) for process in leftover_runs))
