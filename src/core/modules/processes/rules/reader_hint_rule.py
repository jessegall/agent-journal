from engine.enums.agent_role import AgentRole
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from engine.query.queries import Queries
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.models.reader import Reader
from core.modules.processes.support.process_nudges import READER_HINT


class ReaderHintRule(DriverRule):
    """Reading all of an output a reader already reads names the shorter read."""

    name = "processes.reader-hint"
    roles = [AgentRole.MAIN]
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]

    def __init__(self, queries: Queries, outputs: OutputQuery) -> None:
        self.queries, self.outputs = queries, outputs

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        full_reads = [part for part in shell.parts_running_journal_command("output read") if "--all" in part.arguments] if shell is not None else []
        numbers = [int(term) for part in full_reads for term in part.arguments if term.isdigit()]
        kept = self.outputs.process_output(numbers[0]) if numbers else None
        if kept is None or kept.reader_id is None or not kept.reader_lines:
            return RuleAnswer.allowed()
        return RuleAnswer.with_nudges(READER_HINT.nudge(reader=self.queries.query(Reader).find(kept.reader_id).name, output=kept.process_id))
