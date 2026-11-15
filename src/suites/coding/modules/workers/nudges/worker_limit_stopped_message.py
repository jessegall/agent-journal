from engine.driver.message_template import MessageTemplate
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.agent_message_type import AgentMessageType


class WorkerLimitStoppedMessage(MessageTemplate):
    """The nudge workers.limit_stopped."""

    key = "workers.limit_stopped"
    type = AgentMessageType.STEERING
    text = "worker:{worker} is stopped and will not restart: it kept stopping, {tasks}"
    interval = Interval(Seconds(1800))
    turn_limited = False
    wakes_agent = True
