from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class ManagedHookLineMessage(MessageTemplate):
    """The nudge drivers.managed_hook_line."""

    key = "drivers.managed_hook_line"
    type = AgentMessageType.NOTICE
    text = "{line}"
    turn_limited = False
