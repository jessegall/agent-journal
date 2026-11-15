from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class TranscriptionChangedMessage(MessageTemplate):
    """The agent message transcriptions.changed."""

    key = "transcriptions.changed"
    type = AgentMessageType.STEERING
    text = "transcription:{transcription} has new text: summarize it in task:{task}"
    turn_limited = False
