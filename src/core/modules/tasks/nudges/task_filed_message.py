from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class TaskFiledMessage(MessageTemplate):
    """The nudge tasks.filed."""

    key = "tasks.filed"
    type = AgentMessageType.STEERING
    text = "Filed: leave it open, do not start it"
    turn_limited = False
