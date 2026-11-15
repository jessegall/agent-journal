from engine.driver.message_template import MessageTemplate
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.agent_message_type import AgentMessageType


class WorkerUnstartedMessage(MessageTemplate):
    """The nudge workers.unstarted."""

    key = "workers.unstarted"
    type = AgentMessageType.STEERING
    text = "worker:{worker} made no call in {seconds}s"
    interval = Interval(Seconds(600))
    turn_limited = False
    wakes_agent = True
    plural_text = 'workers {worker} made no call in {seconds} seconds'
    id_field = "worker"
