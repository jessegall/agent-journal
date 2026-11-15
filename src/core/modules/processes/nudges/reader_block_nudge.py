from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ReaderBlockNudge(NudgeDeclaration):
    """The nudge processes.reader_block."""

    key = "processes.reader_block"
    type = NudgeType.REFUSAL
    text = "Output {output} has no reader, request {request}: run journal reader draft {request} --save, or mark it unreadable"
    full_text = True
