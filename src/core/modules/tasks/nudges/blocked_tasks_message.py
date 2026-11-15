from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class BlockedTasksMessage(MessageTemplate):
    """The nudge tasks.blocked_tasks."""

    key = "tasks.blocked_tasks"
    type = AgentMessageType.REFUSAL
    text = "Blocked tasks: {tasks}: unblock what can continue, or stop again to leave them"
