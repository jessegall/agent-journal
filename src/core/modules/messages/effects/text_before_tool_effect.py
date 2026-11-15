from collections.abc import Sequence

from engine.agent_machine.contracts.event_effect import EventEffect
from engine.command.command import Command
from engine.driver.hook_event import HookEvent
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from core.modules.drivers.models.hook_call import HookCall
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.messages.commands.send_message.send_message import SendMessage
from core.modules.messages.queries.message_query import MessageQuery
from core.modules.messages.support.agent_text_filter import AgentTextFilter

TEXT_BEFORE_TOOL_KEY = "messages.text-before-tool"


class TextBeforeToolEffect(EventEffect):
    """A text the main agent held after a reply by command and followed by a tool is no closing line, so it reaches
    the chat when the tool's hook comes; one with no tool after it ended the turn and stays out."""

    key = TEXT_BEFORE_TOOL_KEY
    events = [event for event in HookEventName if event is not HookEventName.TICK]
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, hook_calls: HookCallQuery, messages: MessageQuery, texts: AgentTextFilter) -> None:
        self.hook_calls, self.messages, self.texts = hook_calls, messages, texts

    def commands_of(self, event: HookEvent | None, agent_id: int) -> Sequence[Command[object]]:
        if event is None or event.tool is None:
            return []
        calls = self.hook_calls.display_calls_after_turn(agent_id)
        return [SendMessage(call.displayed_text, is_agent_text=True) for call in calls if self.should_send(agent_id, call)]

    def should_send(self, agent_id: int, call: HookCall) -> bool:
        text, displayed_at = call.displayed_text, call.creation_timestamp()
        if not text or self.texts.is_duplicate_reply(agent_id, text, displayed_at):
            return False
        if not self.texts.is_reaction_turn(agent_id, displayed_at) and self.texts.is_acknowledgement(agent_id, text, displayed_at):
            return False
        return not self.messages.has_text_after(agent_id, text, displayed_at) and not self.texts.is_displayed_part(agent_id, text, displayed_at)
