import re

from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.messages.rules.message_read_rule import COMMAND_START
from core.modules.messages.support.message_nudges import REPLY_NOTE

REPLY_LINE = re.compile(COMMAND_START + r"journal message reply (\d+)")


class ReplyNoteRule(DriverRule):
    """After a reply sent by command the main agent is told it is in the chat, so words after it are not written."""

    name = "messages.reply-note"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        reply = REPLY_LINE.search(shell.line) if shell is not None else None
        return RuleAnswer.with_nudges(REPLY_NOTE.nudge(message=reply[1])) if reply else RuleAnswer.allowed()
