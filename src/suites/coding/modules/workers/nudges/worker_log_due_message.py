from engine.driver.message_template import MessageTemplate
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.agent_message_type import AgentMessageType


class WorkerLogDueMessage(MessageTemplate):
    """The nudge workers.worker_log_due."""

    key = "workers.worker_log_due"
    type = AgentMessageType.STEERING
    text = "Nothing logged for {minutes} min: log where you stand"
    interval = Interval(Seconds(1800))
    turn_limited = False
