from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.conditions.greater import Greater
from core.base.query.queries import Queries
from core.modules.drivers.models.hook_call import HookCall
from core.modules.processes.models.process import Process
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.ended_output_text import EndedOutputText
from core.modules.processes.support.process_settings import ProcessSettings


class UnreadOutputReminder(DriverRule):
    """Tells an agent again, every few tool uses, of an output of a run it moved to the background that it has not read."""

    name = "processes.unread-output-reminder"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.WORKER]

    def __init__(self, processes: ProcessQuery, outputs: OutputQuery, text: EndedOutputText, settings: ProcessSettings, queries: Queries) -> None:
        self.processes, self.outputs, self.text, self.settings, self.queries = processes, outputs, text, settings, queries

    def answer(self, hook: AgentHook) -> RuleAnswer:
        every = self.settings.unread_every(hook.environment_id)
        lines = [self.text.line(process) for process in self.processes.agent(hook.agent_id).moved().ended().oldest().all_rows() if self.is_due(hook, process, every)]
        return RuleAnswer.with_lines(*lines)

    def is_due(self, hook: AgentHook, process: Process, every: int) -> bool:
        if process.ended_at is None or not self.outputs.process(process.id).unread().exists():
            return False
        tool_uses = self.queries.query(HookCall).filter(agent_id=hook.agent_id, hook=HookEventName.POST_TOOL_USE).matching(Greater("created_at", process.ended_at.text)).count()
        return (tool_uses + 1) % every == 0
