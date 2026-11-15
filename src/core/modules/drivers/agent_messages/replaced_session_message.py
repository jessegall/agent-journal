from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class ReplacedSessionMessage(MessageTemplate):
    """The nudge drivers.replaced_session."""

    key = "drivers.replaced_session"
    type = AgentMessageType.SAFETY_REFUSAL
    text = "A newer session of agent {agent} replaced this one: stop now, nothing more is recorded"
