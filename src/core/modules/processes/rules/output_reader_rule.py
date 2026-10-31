from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.processes.commands.read_new_output import ReadNewOutput
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.output_folder import OutputFolder


class OutputReaderRule(DriverRule):
    """On each tick, a run of the agent whose output gained bytes since the reader last looked has them passed through its
    reader; this is the only place a reader runs while the run goes on."""

    name = "processes.output-reader"
    hook = HookEventName.TICK
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.WORKER]

    def __init__(self, processes: ProcessQuery, outputs: OutputQuery, folder: OutputFolder) -> None:
        self.processes, self.outputs, self.folder = processes, outputs, folder

    def answer(self, hook: AgentHook) -> RuleAnswer:
        grown = [ReadNewOutput(process.id) for process in self.processes.agent(hook.agent_id).running().oldest().all_rows() if self.has_new_bytes(process.id)]
        return RuleAnswer.allowed().running(*grown)

    def has_new_bytes(self, process_id: int) -> bool:
        output = self.outputs.process(process_id).page(1, 1).rows
        return bool(output) and output[0].reader_id is not None and self.folder.total_bytes(process_id) > output[0].read_offset
