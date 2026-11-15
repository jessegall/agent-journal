from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class AliasAccessRefusalMessage(MessageTemplate):
    """The agent message aliases.access_refused."""

    key = "aliases.access_refused"
    type = AgentMessageType.REFUSAL
    text = "Agents may only run aliases marked for agents: ask the main agent to mark this one"
