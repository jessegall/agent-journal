from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class StartModelMissingMessage(MessageTemplate):
    """The nudge helpers.start_without_model."""

    key = "helpers.start_without_model"
    type = AgentMessageType.REFUSAL
    text = "Name a model when starting a helper, or default for the profile's own"
