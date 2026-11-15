from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class UnreadableInteractiveMessage(MessageTemplate):
    """The nudge processes.unreadable_interactive."""

    key = "processes.unreadable_interactive"
    type = AgentMessageType.STEERING
    text = "Output {output} is waiting for input: stop it; no reader will be asked"
