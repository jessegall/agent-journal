from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class ReaderRepairMessage(MessageTemplate):
    """The agent message processes.readers_need_repair."""

    key = "processes.readers_need_repair"
    type = AgentMessageType.STEERING
    text = "Reader {reader} matched nothing in its last {count} outputs: repair it"
    plural_text = "readers {reader} picked no line of their last {count} outputs: repair them"
