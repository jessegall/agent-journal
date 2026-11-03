from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

WORKER_START_FAILED = NudgeDeclaration("workers.start_failed", NudgeType.STEERING, 'worker:{worker} could not start: journal worker release {worker}, or see journal agent terminal', turn_limited=False)
