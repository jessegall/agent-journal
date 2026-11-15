from engine.driver.message_template import MessageTemplate
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.agent_message_type import AgentMessageType


class DumpOpenMessage(MessageTemplate):
    """The nudge dumps.dump_open."""

    key = "dumps.dump_open"
    type = AgentMessageType.STEERING
    text = "dump {dump} is not filed yet: file it"
    interval = Interval(Seconds(900))
