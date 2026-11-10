from engine.enums.agent_role import AgentRole
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.messages.support.message_nudges import JOURNAL_CHAT_RULE, JOURNAL_LAWS, JOURNAL_LINE_NOTE


class ChatOpeningRule(DriverRule):
    """A main agent's session start tells it what a journal line is, to keep the journal out of the chat, and
    that the laws apply."""

    name = "messages.chat-opening"
    start_line_rule = True
    hook = HookEventName.SESSION_START
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.with_nudges(JOURNAL_LINE_NOTE.nudge(), JOURNAL_CHAT_RULE.nudge(), JOURNAL_LAWS.nudge())
