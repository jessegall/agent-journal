from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class DocumentStopRefusalNudge(NudgeDeclaration):
    """The nudge documents.open-document-stop."""

    key = "documents.open-document-stop"
    type = NudgeType.REFUSAL
    text = "doc:{doc} is open: close it before you stop"
