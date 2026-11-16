from dataclasses import dataclass

from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.request.request_values import RequestValues
from engine.time.clock import Clock
from core.modules.drivers.support.displayed_blocks import DisplayedBlocks
from core.modules.messages.commands.send_message.send_message import SendMessage
from core.modules.messages.agent_messages.closing_choice_message import ClosingChoiceMessage
from core.modules.messages.agent_messages.closing_line_hidden_message import ClosingLineHiddenMessage
from core.modules.messages.agent_messages.repeated_closing_message import RepeatedClosingMessage
from core.modules.messages.support.agent_text_filter import AgentTextFilter
from core.modules.messages.support.question_message import QuestionMessage
from core.modules.messages.support.repeated_messages import RepeatedMessages
from core.modules.messages.support.turn_reply_targets import TurnReplyTargets


@dataclass(frozen=True)
class AgentTextShown:
    """What a finished text block of the agent gives: a line about it, and the chat message it becomes."""

    agent_message: AgentMessage | None
    message: SendMessage | None


class AgentTextAnswer:
    """Each finished text block the main agent writes in a turn becomes a chat message of the agent, unless
    the filter keeps it out; a text held for following a reply is shown once a tool comes. Read once a hook,
    so the line and the message agree."""

    def __init__(self, texts: AgentTextFilter, displayed_blocks: DisplayedBlocks, repeats: RepeatedMessages, targets: TurnReplyTargets, clock: Clock, request_values: RequestValues) -> None:
        self.texts, self.displayed_blocks, self.repeats, self.targets, self.clock, self.request_values = texts, displayed_blocks, repeats, targets, clock, request_values

    def shown(self, event: HookEvent, agent_id: int) -> AgentTextShown:
        # read once a hook whatever changes meanwhile: the message it sends is a text the filter would then find
        return self.request_values.read(f"messages.agent-text:{agent_id}:{event.event_id}", lambda: event.event_id, lambda: self.found(event, agent_id))

    def found(self, event: HookEvent, agent_id: int) -> AgentTextShown:
        nothing = AgentTextShown(None, None)
        now = self.clock.timestamp()
        text = self.displayed_blocks.text(agent_id, event)
        if not text or self.texts.is_reaction_turn(agent_id, now):
            return nothing
        after_reply = self.texts.is_after_reply(agent_id, text, now)
        if (after_reply and self.texts.repeats_reply(agent_id, text, now)) or self.texts.is_acknowledgement(agent_id, text, now):
            return nothing
        if after_reply and self.texts.is_single_line(text):
            return AgentTextShown(ClosingLineHiddenMessage.declared().agent_message(), None)
        repeated = self.repeats.repeated(agent_id, None, text)
        if repeated is not None:
            return AgentTextShown(RepeatedClosingMessage.declared().agent_message(message=repeated.id), None)
        agent_message = ClosingChoiceMessage.declared().agent_message() if QuestionMessage.is_choice(text) else None
        return AgentTextShown(agent_message, SendMessage(text, self.targets.current_parent_id(agent_id, text), is_agent_text=True))
