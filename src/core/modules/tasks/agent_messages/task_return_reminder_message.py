from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class TaskReturnReminderMessage(MessageTemplate):
    """The agent message tasks.task_still_held."""

    key = "tasks.task_still_held"
    type = AgentMessageType.STEERING
    text = "Back to task:{task}: continue, close or release it"
    turn_limited = False
