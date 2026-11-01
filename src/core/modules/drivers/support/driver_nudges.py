from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType
from core.base.driver.rule_outcome import RULE_FAILED

REPEATED_STOP = NudgeDeclaration("drivers.repeated_stop", NudgeType.INSTRUCTION, 'your stop was refused five times in a row: report what held it with journal report create')
OPENING_LINE = NudgeDeclaration("drivers.opening_line", NudgeType.INSTRUCTION, '{text}', once_per_turn=False)

DRIVER_NUDGES = [REPEATED_STOP, OPENING_LINE, RULE_FAILED]
