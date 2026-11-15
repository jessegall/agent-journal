from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ReaderFailedNudge(NudgeDeclaration):
    """The nudge processes.reader_failed."""

    key = "processes.reader_failed"
    type = NudgeType.STEERING
    text = "Reader {reader} failed on output {output}; the full output stays readable"
