from engine.driver.message_template import MessageTemplate
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.agent_message_type import AgentMessageType


class UnansweredMessageReminder(MessageTemplate):
    """The nudge messages.unanswered."""

    key = "messages.unanswered"
    type = AgentMessageType.STEERING
    text = "Answer message {messages} before continuing"
    interval = Interval(Seconds(300))
