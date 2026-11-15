from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class TaskFiledKeepCurrentMessage(MessageTemplate):
    """The nudge tasks.filed_keep_current."""

    key = "tasks.filed_keep_current"
    type = AgentMessageType.STEERING
    text = "Filed: continue task:{task} and leave the new one open"
    turn_limited = False
