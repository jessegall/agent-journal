from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class StockReaderStaleNudge(NudgeDeclaration):
    """The nudge processes.stock_reader_behind."""

    key = "processes.stock_reader_behind"
    type = NudgeType.NOTICE
    text = "Stock reader {reader} is behind the shipped one"
