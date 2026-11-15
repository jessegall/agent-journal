from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class DumpArrivedMessage(MessageTemplate):
    """The nudge dumps.dump_arrived."""

    key = "dumps.dump_arrived"
    type = AgentMessageType.STEERING
    text = "dump:{dump} arrived: read it and file it"
