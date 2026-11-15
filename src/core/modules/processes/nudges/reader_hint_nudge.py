from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.nudge_type import NudgeType


class ReaderHintNudge(NudgeDeclaration):
    """The nudge processes.reader_hint."""

    key = "processes.reader_hint"
    type = NudgeType.STEERING
    text = "Reader {reader} already reads output {output}"
    interval = Interval(Seconds(600))
