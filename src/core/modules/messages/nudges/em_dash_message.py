from engine.driver.message_template import MessageTemplate
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.agent_message_type import AgentMessageType


class EmDashMessage(MessageTemplate):
    """The nudge messages.no_em_dashes."""

    key = "messages.no_em_dashes"
    type = AgentMessageType.STEERING
    text = "No em dashes in the chat: use a full stop"
    interval = Interval(Seconds(600))
