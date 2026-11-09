import re

from core.base.driver.agent_hook import AgentHook
from core.base.driver.command_effect import CommandEffect
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.claude_code.support.claude_code_nudges import NATIVE_MEMORY_BAN

NATIVE_MEMORY_PATH = re.compile(r"\.claude/projects/[^/\s]+/memory(/|\b)")


class NativeMemoryRule(DriverRule):
    """A write into Claude Code's own memory folder is refused, under every overlay: the journal keeps the
    memories."""

    name = "claude_code.native-memory"
    exempt = True
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    refuses_one_action = "A write into Claude Code's own memory folder is refused, under every overlay"

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is None or not tool.is_writing_files():
            return RuleAnswer.allowed()
        writing_texts = (*(part.text for part in tool.shell.parts if CommandEffect.WRITES_FILES in part.classification.effects), *tool.shell.redirects) if tool.shell is not None else ()
        if any(NATIVE_MEMORY_PATH.search(text) for text in (*tool.files, *writing_texts)):
            return RuleAnswer.refused(NATIVE_MEMORY_BAN.nudge())
        return RuleAnswer.allowed()
