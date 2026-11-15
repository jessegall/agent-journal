from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class EndedAgentMessage(MessageTemplate):
    """The nudge drivers.ended_agent."""

    key = "drivers.ended_agent"
    type = AgentMessageType.SAFETY_REFUSAL
    text = "This agent has ended: stop now, nothing more is recorded"
