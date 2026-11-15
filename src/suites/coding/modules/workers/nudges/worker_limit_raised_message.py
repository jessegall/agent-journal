from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerLimitRaisedMessage(MessageTemplate):
    """The nudge workers.limit_raised."""

    key = "workers.limit_raised"
    type = AgentMessageType.STEERING
    text = "Worker limit is now {limit}: {workers} out, {count} open tasks not delegated: hand out more"
    turn_limited = False
