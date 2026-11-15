from engine.driver.message_template import MessageTemplate
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.agent_message_type import AgentMessageType


class WorkerUnmergedDueMessage(MessageTemplate):
    """The nudge workers.worker_unmerged_due."""

    key = "workers.worker_unmerged_due"
    type = AgentMessageType.STEERING
    text = "worker:{worker} committed {tasks}, not merged: {action}"
    interval = Interval(Seconds(300))
    turn_limited = False
    wakes_agent = True
    required_command = "journal worker merge {worker}"
