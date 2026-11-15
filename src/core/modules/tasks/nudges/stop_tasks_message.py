from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class StopTasksMessage(MessageTemplate):
    """The nudge tasks.tasks_at_stop."""

    key = "tasks.tasks_at_stop"
    type = AgentMessageType.REFUSAL
    text = "In hand: {tasks}: continue, or close, release or block each one"
