from core.modules.processes.support.process_nudges import JOURNAL_COMMAND_LAST
import re

from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.part import Part
from core.base.driver.rule_answer import RuleAnswer
from core.modules.processes.support.background_commands import JOURNAL

LOOPS = ("until", "while", "for")
QUOTED = re.compile(r'\'[^\']*\'|"(?:\\.|[^"\\])*"')
JOURNAL_COMMAND = re.compile(rf"(^|[;(|&]\s*|\bdo\s+|\buntil\s+|\bwhile\s+|\bthen\s+){JOURNAL}\s+[a-z]")


class JournalChainRule(DriverRule):
    """Refuses a journal command after a command that may run long, such as a test or a build, or inside a
    loop; a word inside quotes is text, never a command."""

    name = "processes.journal-chain"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    refuses_one_action = "A journal command after a long command, or inside a loop, is refused"

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is None or shell.parse_error:
            return RuleAnswer.allowed()
        has_long_part = False
        for part in shell.parts:
            if self.is_journal_loop(part) or (part.program == JOURNAL and has_long_part):
                return RuleAnswer.refused(JOURNAL_COMMAND_LAST.nudge())
            has_long_part = has_long_part or not part.classification.category.is_short
        return RuleAnswer.allowed()

    def is_journal_loop(self, part: Part) -> bool:
        return part.program in LOOPS and JOURNAL_COMMAND.search(QUOTED.sub('""', part.text)) is not None
