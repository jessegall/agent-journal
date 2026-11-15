from engine.driver.message_template import MessageTemplate
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.agent_message_type import AgentMessageType


class UpdateWaitingMessage(MessageTemplate):
    """The agent message processes.update_waiting."""

    key = "processes.update_waiting"
    type = AgentMessageType.STEERING
    text = "An update waits for {outputs} to end: no new command starts until it is done"
    interval = Interval(Seconds(300))
    turn_limited = False
