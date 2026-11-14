from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType

DOCUMENT_OPEN = NudgeDeclaration("documents.open-document", NudgeType.REFUSAL,
    "doc:{doc} is open: close it before editing files")
DOCUMENT_STOP_REFUSAL = NudgeDeclaration("documents.open-document-stop", NudgeType.REFUSAL,
    "doc:{doc} is open: close it before you stop")
