from engine.driver.message_template import MessageTemplate
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.agent_message_type import AgentMessageType


class WorkerLateRunMessage(MessageTemplate):
    """The agent message workers.run_outlasts."""

    key = "workers.run_outlasts"
    type = AgentMessageType.STEERING
    text = "worker:{worker} stopped but output {output} is still running: stop that output"
    interval = Interval(Seconds(600))
    turn_limited = False
    wakes_agent = True
