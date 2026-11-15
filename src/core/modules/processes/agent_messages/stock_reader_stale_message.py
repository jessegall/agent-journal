from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class StockReaderStaleMessage(MessageTemplate):
    """The agent message processes.stock_reader_behind."""

    key = "processes.stock_reader_behind"
    type = AgentMessageType.NOTICE
    text = "Stock reader {reader} is behind the shipped one"
