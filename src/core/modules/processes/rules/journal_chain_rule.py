import re

from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.part import Part
from core.base.driver.rule_answer import RuleAnswer

JOURNAL = "journal"
LOOPS = ("until", "while", "for")
JOURNAL_COMMAND = re.compile(rf"(^|[\s;(|&]){JOURNAL}\s+[a-z]")
REFUSAL = "journal commands must come first in a line and never in a loop: run this one on its own line"


class JournalChainRule(DriverRule):
    """Refuses a journal command after another command in a line, or inside a loop."""

    name = "processes.journal-chain"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.WORKER]

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is None or shell.parse_error:
            return RuleAnswer.allowed()
        programs = [part.program for part in shell.parts]
        leading = next((index for index, program in enumerate(programs) if program != JOURNAL), len(programs))
        if JOURNAL in programs[leading:] or any(self.is_journal_loop(part) for part in shell.parts):
            return RuleAnswer.refused(REFUSAL)
        return RuleAnswer.allowed()

    def is_journal_loop(self, part: Part) -> bool:
        return part.program in LOOPS and JOURNAL_COMMAND.search(part.text) is not None
