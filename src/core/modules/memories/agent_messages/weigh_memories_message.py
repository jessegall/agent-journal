from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WeighMemoriesMessage(MessageTemplate):
    """The nudge memories.weigh_memories."""

    key = "memories.weigh_memories"
    type = AgentMessageType.NOTICE
    text = "Context at {percent}%: weigh your {count} memories within {uses} tool uses, heaviest first: {memories}. Compaction loses nothing you keep: carry on"
    turn_limited = False
