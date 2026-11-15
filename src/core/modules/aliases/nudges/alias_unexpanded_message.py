from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class AliasUnexpandedMessage(MessageTemplate):
    """The nudge aliases.unexpanded."""

    key = "aliases.unexpanded"
    type = AgentMessageType.REFUSAL
    text = "The alias in this line could not be expanded: check its name and arguments"
