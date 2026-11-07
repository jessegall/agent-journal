from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

DOCUMENT_OPEN = NudgeDeclaration("documents.open-document", NudgeType.REFUSAL,
    "doc:{doc} is open")
