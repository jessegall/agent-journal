from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.messages.commands.send_message.send_message import SendMessage
from core.modules.messages.support.agent_text_filter import AgentTextFilter
from core.modules.messages.support.message_nudges import CLOSING_LINE_HIDDEN, REPEATED_CLOSING
from core.modules.messages.support.repeated_messages import RepeatedMessages


class AgentTextRule(DriverRule):
    """Each finished text block the agent writes in a turn becomes a chat message of the agent, unless the
    filter keeps it out; a text held for following a reply is shown by ToolMessageRule once a tool comes."""

    name = "messages.agent-text"
    hook = HookEventName.MESSAGE_DISPLAY
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, texts: AgentTextFilter, hook_calls: HookCallQuery, repeats: RepeatedMessages) -> None:
        self.texts, self.hook_calls, self.repeats = texts, hook_calls, repeats

    def answer(self, hook: AgentHook) -> RuleAnswer:
        text = self.hook_calls.displayed_block(hook.agent_id, hook.event)
        if not text or self.texts.is_reaction_turn(hook.agent_id, hook.timestamp):
            return RuleAnswer.allowed()
        after_reply = self.texts.is_after_reply(hook.agent_id, text, hook.timestamp)
        if (after_reply and self.texts.repeats_reply(hook.agent_id, text, hook.timestamp)) or self.texts.is_acknowledgement(hook.agent_id, text, hook.timestamp):
            return RuleAnswer.allowed()
        if after_reply and self.texts.is_single_line(text):
            return RuleAnswer.with_nudges(CLOSING_LINE_HIDDEN.nudge())
        repeated =self.repeats.repeated(hook.agent_id, text)
        if repeated is not None:
            return RuleAnswer.with_nudges(REPEATED_CLOSING.nudge(message=repeated.id))
        return RuleAnswer.allowed().running(SendMessage(text))
