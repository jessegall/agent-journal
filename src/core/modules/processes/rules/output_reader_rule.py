from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.processes.commands.read_new_output.read_new_output import ReadNewOutput
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.grown_outputs import GrownOutputs


class OutputReaderRule(DriverRule):
    """On each tick, a run of the agent whose output gained bytes since the reader last looked has them passed
    through its reader; between ticks the server's output read round does the same."""

    name = "processes.output-reader"
    hook = HookEventName.TICK
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.WORKER]

    def __init__(self, processes: ProcessQuery, grown: GrownOutputs) -> None:
        self.processes, self.grown = processes, grown

    def answer(self, hook: AgentHook) -> RuleAnswer:
        grown = [ReadNewOutput(process.id) for process in self.processes.agent(hook.agent_id).running().oldest().all_rows() if self.grown.has_new_bytes(process.id)]
        return RuleAnswer.allowed().running(*grown)
