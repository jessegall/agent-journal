from engine.driver.message_template import MessageTemplate
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.agent_message_type import AgentMessageType


class LargeOutputReadMessage(MessageTemplate):
    """The agent message processes.large_output_read."""

    key = "processes.large_output_read"
    type = AgentMessageType.STEERING
    text = "Output {output} has {lines} lines: read it with --summary, --tail K or --lines A-B"
    interval = Interval(Seconds(604800))
