from core.base.driver.nudge_declaration import AUTHORED_LINE_CHARACTERS, NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

ALIAS_REFUSAL = NudgeDeclaration("aliases.refusal", NudgeType.REFUSAL, "{text}", longest_characters=AUTHORED_LINE_CHARACTERS)
