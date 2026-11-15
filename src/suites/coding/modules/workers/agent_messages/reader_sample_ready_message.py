from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class ReaderSampleReadyMessage(MessageTemplate):
    """The nudge workers.reader_sample_ready."""

    key = "workers.reader_sample_ready"
    type = AgentMessageType.STEERING
    text = "Read the sample of output {output} with reader {reader}"
    wakes_agent = True
