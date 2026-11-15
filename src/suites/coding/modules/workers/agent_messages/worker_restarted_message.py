from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerRestartedMessage(MessageTemplate):
    """The nudge workers.restarted."""

    key = "workers.restarted"
    type = AgentMessageType.STEERING
    text = "worker:{worker} stopped with {tasks} left and was started again"
    turn_limited = False
