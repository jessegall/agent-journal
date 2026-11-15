from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ReaderRequestRefusalNudge(NudgeDeclaration):
    """The nudge processes.reader_request_refusal."""

    key = "processes.reader_request_refusal"
    type = NudgeType.REFUSAL
    text = "Reader request {request} needs a reader first"
