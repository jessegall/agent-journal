from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class ClosingChoiceMessage(MessageTemplate):
    """The nudge messages.closing_choice."""

    key = "messages.closing_choice"
    type = AgentMessageType.STEERING
    text = "Your closing words ask the user to choose: put the choice in the question tool instead"
