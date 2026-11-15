from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class TranscriptionImportRequestMessage(MessageTemplate):
    """The agent message transcriptions.fetch_requested."""

    key = "transcriptions.fetch_requested"
    type = AgentMessageType.STEERING
    text = "Fetch the transcriptions task:{task} asks for"
    turn_limited = False
