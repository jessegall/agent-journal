from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ReaderProgressMissingNudge(NudgeDeclaration):
    """The nudge processes.reader_no_progress."""

    key = "processes.reader_no_progress"
    type = NudgeType.STEERING
    text = "Output {output} showed no progress: give reader {reader} a --progress or --step pattern"
