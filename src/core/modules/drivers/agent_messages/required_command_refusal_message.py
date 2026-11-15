from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class RequiredCommandRefusalMessage(MessageTemplate):
    """The agent message drivers.required_command_refusal."""

    key = "drivers.required_command_refusal"
    type = AgentMessageType.REFUSAL
    text = "{subject} is due: do it now, or skip block {block} with a reason"
