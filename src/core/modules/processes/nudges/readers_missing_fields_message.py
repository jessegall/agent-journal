from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class ReadersMissingFieldsMessage(MessageTemplate):
    """The nudge processes.readers_missing_fields."""

    key = "processes.readers_missing_fields"
    type = AgentMessageType.STEERING
    text = "{count} readers lack required fields: draft one when an agent asks"
