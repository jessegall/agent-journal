from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

DUMP_OPEN = NudgeDeclaration("dumps.dump_open", NudgeType.INSTRUCTION, "dump {dump} is not filed; what is left: journal dump items {dump}", repeat_seconds=900)

DUMP_NUDGES = [DUMP_OPEN]
