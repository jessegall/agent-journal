from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class UnloggedWritesMessage(MessageTemplate):
    """The nudge tasks.unlogged_writes."""

    key = "tasks.unlogged_writes"
    type = AgentMessageType.REFUSAL
    text = "Log task {task} now: 0 writes left"
