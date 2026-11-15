from engine.driver.message_template import MessageTemplate
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.agent_message_type import AgentMessageType


class SharedTitleMessage(MessageTemplate):
    """The nudge processes.shared_title."""

    key = "processes.shared_title"
    type = AgentMessageType.STEERING
    text = "Outputs {outputs} share one title: give each its own"
    interval = Interval(Seconds(600))
