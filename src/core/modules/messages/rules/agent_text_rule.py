from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.messages.commands.send_message.send_message import SendMessage
from core.modules.messages.support.agent_text_filter import AgentTextFilter


class AgentTextRule(DriverRule):
    """Each finished text block the agent writes in a turn becomes a chat message of the agent, unless the
    filter keeps it out; a text held for following a reply is shown by ToolMessageRule once a tool comes."""

    name = "messages.agent-text"
    hook = HookEventName.MESSAGE_DISPLAY
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, texts: AgentTextFilter) -> None:
        self.texts = texts

    def answer(self, hook: AgentHook) -> RuleAnswer:
        text = hook.event.displayed_text
        if not text or self.texts.is_reaction_turn(hook.agent_id, hook.timestamp) or self.texts.is_duplicate_reply(hook.agent_id, text, hook.timestamp) or self.texts.is_acknowledgement(hook.agent_id, text, hook.timestamp):
            return RuleAnswer.allowed()
        return RuleAnswer.allowed().running(SendMessage(text))
