from engine.enums.agent_role import AgentRole
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.messages.support.message_nudges import REPLY_NOTE


class ReplyNoteRule(DriverRule):
    """After a reply sent by command the main agent is told it is in the chat, so words after it are not written."""

    name = "messages.reply-note"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        replies = shell.journal_command_numbers("message reply") if shell is not None else ()
        return RuleAnswer.with_nudges(REPLY_NOTE.nudge(message=replies[0])) if replies else RuleAnswer.allowed()
