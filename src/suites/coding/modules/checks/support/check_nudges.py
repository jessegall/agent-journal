from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

CHECK_FAILED = NudgeDeclaration("checks.check_failed", NudgeType.INSTRUCTION, '{text}', once_per_turn=False)

CHECK_NUDGES = [CHECK_FAILED]
