from engine.driver.message_template import MessageTemplate
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.agent_message_type import AgentMessageType


class RunQueueHaltedMessage(MessageTemplate):
    """The agent message processes.run_queue_halted."""

    key = "processes.run_queue_halted"
    type = AgentMessageType.STEERING
    text = "The process queue is halted, so no queued run starts: resume it when it may continue"
    interval = Interval(Seconds(300))
    turn_limited = False
