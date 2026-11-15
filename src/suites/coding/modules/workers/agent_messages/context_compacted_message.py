from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class ContextCompactedMessage(MessageTemplate):
    """The agent message workers.context_compacted."""

    key = "workers.context_compacted"
    type = AgentMessageType.NOTICE
    text = "Your context passed the limit: it is being compacted"
    turn_limited = False
