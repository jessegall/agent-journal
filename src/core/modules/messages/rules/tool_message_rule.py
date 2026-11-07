from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_wildcard import HookWildcard
from core.base.driver.rule_answer import RuleAnswer
from core.modules.drivers.models.hook_call import HookCall
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.messages.commands.send_message.send_message import SendMessage
from core.modules.messages.queries.message_query import MessageQuery
from core.modules.messages.support.agent_text_filter import AgentTextFilter


class ToolMessageRule(DriverRule):
    """A text held after a reply by command and followed by a tool is no closing line, so it reaches the chat when
    the tool's hook comes; one with no tool after it ended the turn and stays out."""

    name = "messages.text-before-tool"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    roles = [AgentRole.MAIN]
    overlay_proof = True
    is_notice = True

    def __init__(self, hook_calls: HookCallQuery, messages: MessageQuery, texts: AgentTextFilter) -> None:
        self.hook_calls, self.messages, self.texts = hook_calls, messages, texts

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if hook.event.tool is None:
            return RuleAnswer.allowed()
        calls = self.hook_calls.display_calls_after_turn(hook.agent_id)
        return RuleAnswer.allowed().running(*(SendMessage(call.displayed_text) for call in calls if self.should_send(hook, call)))

    def should_send(self, hook: AgentHook, call: HookCall) -> bool:
        text, displayed_at = call.displayed_text, call.creation_timestamp()
        if not text or self.texts.is_duplicate_reply(hook.agent_id, text, displayed_at):
            return False
        if not self.texts.is_reaction_turn(hook.agent_id, displayed_at) and self.texts.is_acknowledgement(hook.agent_id, text, displayed_at):
            return False
        return not self.messages.has_text_after(hook.agent_id, text, displayed_at) and not self.texts.is_displayed_part(hook.agent_id, text, displayed_at)
