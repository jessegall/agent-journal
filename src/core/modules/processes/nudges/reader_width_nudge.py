from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ReaderWidthNudge(NudgeDeclaration):
    """The nudge processes.reader_too_wide."""

    key = "processes.reader_too_wide"
    type = NudgeType.STEERING
    text = "Reader {reader} kept {kept} of {lines} lines of output {output}: narrow it"
    required_command = "journal reader add {reader}"
