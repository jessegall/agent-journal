from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.queries import Queries
from core.modules.processes.models.output import Output
from core.modules.processes.models.reader import Reader
from core.modules.processes.support.process_nudges import READER_HINT


class ReaderHintRule(DriverRule):
    """Reading all of an output a reader already reads names the shorter read."""

    name = "processes.reader-hint"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        full_reads = [part for part in shell.parts_running_journal_command("output read") if "--all" in part.arguments] if shell is not None else []
        numbers = [int(term) for part in full_reads for term in part.arguments if term.isdigit()]
        kept = self.queries.query(Output).filter(process_id=numbers[0]).limited(1) if numbers else ()
        if not kept or kept[0].reader_id is None or not kept[0].reader_lines:
            return RuleAnswer.allowed()
        return RuleAnswer.with_nudges(READER_HINT.nudge(reader=self.queries.query(Reader).find(kept[0].reader_id).name, output=kept[0].process_id))
