from engine.driver.message_template import MessageTemplate
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.agent_message_type import AgentMessageType


class ReaderHintMessage(MessageTemplate):
    """The agent message processes.reader_hint."""

    key = "processes.reader_hint"
    type = AgentMessageType.STEERING
    text = "Reader {reader} already reads output {output}"
    interval = Interval(Seconds(600))
