from engine.helper_type.helper_type_book import HelperTypeBook
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.processes.commands.orphan_process.orphan_process import OrphanProcess
from core.modules.processes.queries.process_query import ProcessQuery

LEFTOVER_RUNS_REASON = "every run the agent left running when it stopped is orphaned"


class LeftoverRunRule(DriverRule):
    """Ends the runs the agent started in an old session unless the suite declares that its runs continue. A run the
    journal started for the agent is not the agent's to end."""

    name = "processes.leftover-runs"
    hook = HookEventName.SESSION_START
    drivers = ["*"]

    def __init__(self, processes: ProcessQuery, types: HelperTypeBook) -> None:
        self.processes, self.types = processes, types

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if hook.event.is_continuing or self.types.behaviours(hook.role).keeps_runs_after_end:
            return RuleAnswer.allowed()
        leftover_runs = self.processes.agent_started(hook.agent_id).running().every_row(LEFTOVER_RUNS_REASON)
        return RuleAnswer.allowed().running(*(OrphanProcess(process.id) for process in leftover_runs))
