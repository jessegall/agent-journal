from engine.driver.message_template import MessageTemplate
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.agent_message_type import AgentMessageType


class WorkerProcessEndedMessage(MessageTemplate):
    """The agent message workers.process_ended."""

    key = "workers.process_ended"
    type = AgentMessageType.STEERING
    text = "worker:{worker} is stopped and will not restart: its process ended, {tasks}"
    interval = Interval(Seconds(300))
    turn_limited = False
    wakes_agent = True
