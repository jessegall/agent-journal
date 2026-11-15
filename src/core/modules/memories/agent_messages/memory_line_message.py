from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class MemoryLineMessage(MessageTemplate):
    """The agent message memories.memory_line."""

    key = "memories.memory_line"
    type = AgentMessageType.STEERING
    text = "memory:{memory} applies now: follow it"
    turn_limited = False
