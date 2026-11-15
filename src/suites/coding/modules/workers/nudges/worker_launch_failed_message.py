from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerLaunchFailedMessage(MessageTemplate):
    """The nudge workers.launch_failed."""

    key = "workers.launch_failed"
    type = AgentMessageType.STEERING
    text = "worker:{worker} failed to start: {line}"
    turn_limited = False
