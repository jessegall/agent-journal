from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class IgnoredWakeMessage(MessageTemplate):
    """The agent message drivers.ignored-wake, told once to the parent of an agent that took no turn after its wakes."""

    key = "drivers.ignored-wake"
    type = AgentMessageType.NOTICE
    text = "agent {agent} took no turn after {count} wakes: journal agent-wake list --agent {agent}"
