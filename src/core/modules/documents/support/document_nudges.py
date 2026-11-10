from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.nudge_type import NudgeType

DOCUMENT_OPEN = NudgeDeclaration("documents.open-document", NudgeType.REFUSAL,
    "doc:{doc} is open: close it to edit files")
DOCUMENT_STOP_REFUSAL = NudgeDeclaration("documents.open-document-stop", NudgeType.REFUSAL,
    "doc:{doc} is open: close it, then stop")
