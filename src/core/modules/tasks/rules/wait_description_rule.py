import re

from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.tasks.support.task_nudges import WAIT_DESCRIPTION


WAIT_TERMS = re.compile(r"\b(wait(s|ing)?\s+(for|on|until)|blocked\s+(on|by|until))\b", re.I)
DESCRIBED_LINE = re.compile(r"(?:^|-- '|&& |; )journal (task log|task block|message send|message reply)\b")
BLOCK_FLAGS = ("--on", "--until")


class WaitDescriptionRule(DriverRule):
    """A log line, a block's reason or a message that says the work waits, in words, teaches the block that
    opens by itself."""

    name = "tasks.wait-in-words"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is None or not DESCRIBED_LINE.search(shell.line) or not WAIT_TERMS.search(shell.line) or any(flag in shell.line for flag in BLOCK_FLAGS):
            return RuleAnswer.allowed()
        return RuleAnswer.with_nudges(WAIT_DESCRIPTION.nudge())
