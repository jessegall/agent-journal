from engine.driver.message_template import MessageTemplate
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.agent_message_type import AgentMessageType


class BrokenTaskWaitMessage(MessageTemplate):
    """The nudge checks.broken_task_wait."""

    key = "checks.broken_task_wait"
    type = AgentMessageType.STEERING
    text = "task:{task} waits on a command that cannot run: fix or change the wait"
    interval = Interval(Seconds(1800))
