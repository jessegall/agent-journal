from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class OldHookLineMessage(MessageTemplate):
    """The agent message drivers.old_hook_line."""

    key = "drivers.old_hook_line"
    type = AgentMessageType.SAFETY_REFUSAL
    text = "Your hooks are too old to judge this line: update the journal, then restart the agent"
