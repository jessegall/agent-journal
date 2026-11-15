from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class AgentLineAvailableMessage(MessageTemplate):
    """The nudge drivers.agent_line_available."""

    key = "drivers.agent_line_available"
    type = AgentMessageType.NOTICE
    text = "agent-line:{line}"
    turn_limited = False
    id_field = "line"
    plural_text = "agent-lines {line}"
