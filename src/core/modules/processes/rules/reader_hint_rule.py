import re

from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.queries import Queries
from core.modules.processes.models.output import Output
from core.modules.processes.models.reader import Reader
from core.modules.processes.support.process_nudges import READER_HINT

WHOLE_READ_LINE = re.compile(r"(?:^|-- '|&& |; )journal output read (\d+) --all\b")


class ReaderHintRule(DriverRule):
    """Reading all of an output a reader already reads names the shorter read."""

    name = "processes.reader-hint"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        line = WHOLE_READ_LINE.search(shell.line) if shell is not None else None
        kept = self.queries.query(Output).filter(process_id=int(line.group(1))).page(1, 1).rows if line is not None else ()
        if not kept or kept[0].reader_id is None or not kept[0].reader_lines:
            return RuleAnswer.allowed()
        return RuleAnswer.with_nudges(READER_HINT.nudge(reader=self.queries.query(Reader).find(kept[0].reader_id).name, output=kept[0].process_id))
