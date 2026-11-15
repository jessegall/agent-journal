from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class UnknownAgentMessage(MessageTemplate):
    """The nudge drivers.unknown_agent."""

    key = "drivers.unknown_agent"
    type = AgentMessageType.SAFETY_REFUSAL
    text = "No agent exists in the journal for this session, so the tool did not run: report what happened"
