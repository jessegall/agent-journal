from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class DocumentOpenNudge(NudgeDeclaration):
    """The nudge documents.open-document."""

    key = "documents.open-document"
    type = NudgeType.REFUSAL
    text = "doc:{doc} is open: close it before editing files"
