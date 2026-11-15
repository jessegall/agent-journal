from engine.driver.seconds import Seconds
from engine.driver.message_template import MessageTemplate
from engine.driver.interval import Interval
from engine.enums.agent_message_type import AgentMessageType

READER_REQUEST_REMINDER = Seconds(600)


class ReaderRequestMessage(MessageTemplate):
    """The nudge processes.reader_request."""

    key = "processes.reader_request"
    type = AgentMessageType.STEERING
    text = "Reader request {request}: agent {agent} needs a reader for output {output}"
    interval = Interval(READER_REQUEST_REMINDER)
    turn_limited = False
