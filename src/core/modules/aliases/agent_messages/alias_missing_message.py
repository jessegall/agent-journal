from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class AliasMissingMessage(MessageTemplate):
    """The agent message aliases.missing."""

    key = "aliases.missing"
    type = AgentMessageType.REFUSAL
    text = "This line uses an alias that no longer exists: use the plain command or another alias"
