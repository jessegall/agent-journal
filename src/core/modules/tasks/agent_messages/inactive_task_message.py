from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class InactiveTaskMessage(MessageTemplate):
    """The agent message tasks.inactive_task."""

    key = "tasks.inactive_task"
    type = AgentMessageType.STEERING
    text = "Nothing happened for {minutes} min: continue task:{task}, or log why it waits"
    turn_limited = False
