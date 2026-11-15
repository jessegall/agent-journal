from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class HelperTypeCommandMessage(MessageTemplate):
    """The agent message drivers.helper_type_command."""

    key = "drivers.helper_type_command"
    type = AgentMessageType.REFUSAL
    text = "A {helper_type} may not run {line}: it runs the groups {groups} and the lines {lines}; ask your main agent"
    full_text = True
