from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class CompactionInstructionsMessage(MessageTemplate):
    """The nudge drivers.compaction_instructions."""

    key = "drivers.compaction_instructions"
    type = AgentMessageType.NOTICE
    text = "{text}"
    turn_limited = False
    full_text = True
