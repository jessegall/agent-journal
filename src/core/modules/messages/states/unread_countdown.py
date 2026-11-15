from core.modules.drivers.models.support.tool_use_span import ToolUseSpan
from core.modules.messages.support.message_nudges import UNREAD_COUNTDOWN, UNREAD_TOOL_USES
from core.modules.messages.nudges.unread_refusal_nudge import UnreadRefusalNudge
from engine.driver.states.countdown_state import CountdownState


class UnreadCountdown(CountdownState):
    """The hold on an agent that has unread messages: twenty tool uses count down, then its tools are
    refused until the messages are read. The state is open while the hold is; it gates no rule, since the
    agent block rule enforces every block."""

    name = "messages.unread-countdown"
    span = ToolUseSpan(UNREAD_TOOL_USES)
    refusal = UnreadRefusalNudge.declared()
    countdown = UNREAD_COUNTDOWN
