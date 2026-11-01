import re

from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.command_category import CommandCategory
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.part import Part
from core.base.driver.rule_answer import RuleAnswer

JOURNAL = "journal"
LOOPS = ("until", "while", "for")
SHORT_CATEGORIES = (CommandCategory.JOURNAL, CommandCategory.READ, CommandCategory.SEARCH, CommandCategory.EDIT)
JOURNAL_COMMAND = re.compile(rf"(^|[;(|&]\s*|\bdo\s+|\buntil\s+|\bwhile\s+|\bthen\s+){JOURNAL}\s+[a-z]")
REFUSAL = "a journal command may not follow a long command or run in a loop: run it on its own line"


class JournalChainRule(DriverRule):
    """Refuses a journal command after a command that may run long, such as a test or a build, or inside a loop."""

    name = "processes.journal-chain"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.WORKER]

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is None or shell.parse_error:
            return RuleAnswer.allowed()
        has_long_part = False
        for part in shell.parts:
            if self.is_journal_loop(part) or (part.program == JOURNAL and has_long_part):
                return RuleAnswer.refused(REFUSAL)
            has_long_part = has_long_part or part.classification.category not in SHORT_CATEGORIES
        return RuleAnswer.allowed()

    def is_journal_loop(self, part: Part) -> bool:
        return part.program in LOOPS and JOURNAL_COMMAND.search(part.text) is not None
