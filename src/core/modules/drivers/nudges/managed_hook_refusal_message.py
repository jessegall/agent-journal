from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class ManagedHookRefusalMessage(MessageTemplate):
    """The nudge drivers.managed_hook_refusal."""

    key = "drivers.managed_hook_refusal"
    type = AgentMessageType.REFUSAL
    text = "Project hooks refused for agent:{agent}"
    turn_limited = False
