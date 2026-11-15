from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType

WORKER_REFUSAL_INTERVAL = Interval(Seconds(600))


class WorkerRefusalMessage(MessageTemplate):
    """The nudge workers.repeated_refusal."""

    key = "workers.repeated_refusal"
    type = AgentMessageType.STEERING
    text = "worker:{worker} hit {count} refusals on task:{task}: check what is blocking it"
    interval = WORKER_REFUSAL_INTERVAL
    turn_limited = False
