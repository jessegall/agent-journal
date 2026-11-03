from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.command_category import CommandCategory
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.processes.models.reader import Reader
from core.modules.processes.queries.reader_query import ReaderQuery
from core.modules.processes.support.process_nudges import READERS_MISSING_FIELDS
from core.modules.processes.support.reader_judge import ReaderJudge


class ReaderStartRule(DriverRule):
    """Tells a main agent how many readers lack required fields, without blocking it."""

    name = "processes.readers-at-start"
    start_line_rule = True
    hook = HookEventName.SESSION_START
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, readers: ReaderQuery, judge: ReaderJudge) -> None:
        self.readers, self.judge = readers, judge

    def answer(self, hook: AgentHook) -> RuleAnswer:
        count = sum(self.has_missing_fields(reader) for reader in self.readers.all_rows())
        return RuleAnswer.with_nudges(READERS_MISSING_FIELDS.nudge(count=count)) if count else RuleAnswer.allowed()

    def has_missing_fields(self, reader: Reader) -> bool:
        categories = {CommandCategory.CHECK, *(part.category for part in self.judge.samples(reader))}
        return any(self.judge.fields_missing(reader, category) for category in categories)
