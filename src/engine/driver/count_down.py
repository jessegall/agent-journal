from dataclasses import dataclass

from engine.driver.agent_message import AgentMessage
from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType
from engine.driver.span import Span
from engine.driver.time_window import TimeWindow

COUNTDOWN_TOOL_USES = 3


@dataclass(frozen=True)
class CountDown:
    """A line counting down to a hold: the action due and how much of its span remains, the one form every such
    line takes, such as read message 123 due: 3 tool uses. A silent one says nothing, and any other says its
    line only once fewer than line_limit remain."""

    key: str
    action: str
    span: Span | TimeWindow
    is_silent: bool = False
    line_limit: int = COUNTDOWN_TOOL_USES

    @property
    def declaration(self) -> MessageTemplate:
        return MessageTemplate(self.key, AgentMessageType.STEERING, f"{self.action} due: {{remaining}} {self.span.unit}", turn_limited=False)

    def agent_message(self, remaining: object, **fields: object) -> AgentMessage:
        return self.declaration.agent_message(remaining=remaining, **fields)

    def remaining_after(self, used_count: int) -> int:
        return max(self.span.count - used_count, 0)

    def line_at(self, remaining: int, **fields: object) -> AgentMessage | None:
        if self.is_silent or remaining >= self.line_limit:
            return None
        return self.agent_message(remaining, **fields)
