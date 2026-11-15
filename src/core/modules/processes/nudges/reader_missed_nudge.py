from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ReaderMissedNudge(NudgeDeclaration):
    """The nudge processes.reader_missed."""

    key = "processes.reader_missed"
    type = NudgeType.STEERING
    text = "Reader {reader} matched none of the {lines} lines of output {output}: fix it"
    required_command = "journal reader add {reader}"
