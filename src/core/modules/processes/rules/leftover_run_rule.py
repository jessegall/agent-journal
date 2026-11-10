from core.modules.drivers.support.suite_choice import SuiteChoice
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.processes.commands.orphan_process.orphan_process import OrphanProcess
from core.modules.processes.queries.process_query import ProcessQuery


class LeftoverRunRule(DriverRule):
    """Ends the runs the agent started in an old session unless the suite declares that its runs continue. A run the
    journal started for the agent is not the agent's to end."""

    name = "processes.leftover-runs"
    hook = HookEventName.SESSION_START
    drivers = ["*"]

    def __init__(self, processes: ProcessQuery, suites: SuiteChoice) -> None:
        self.processes, self.suites = processes, suites

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if hook.event.is_continuing or hook.role in self.suites.agent_policy().continuing_run_roles:
            return RuleAnswer.allowed()
        leftover_runs = self.processes.agent_started(hook.agent_id).running().oldest().all_rows()
        return RuleAnswer.allowed().running(*(OrphanProcess(process.id) for process in leftover_runs))
