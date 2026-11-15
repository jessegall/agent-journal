from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class StartMemoriesMessage(MessageTemplate):
    """The agent message memories.start_memories."""

    key = "memories.start_memories"
    type = AgentMessageType.STEERING
    text = '{count} memories to read: load the memory skill as directed, then list them'
    turn_limited = False
    required_command = "journal memory list"
