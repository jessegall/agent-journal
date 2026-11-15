from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class CurrentTaskMessage(MessageTemplate):
    """The agent message tasks.task_in_hand."""

    key = "tasks.task_in_hand"
    type = AgentMessageType.STEERING
    text = 'task:{task} is in hand'
    turn_limited = False
