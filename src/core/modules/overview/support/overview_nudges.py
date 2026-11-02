from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

OVERVIEW_REFUSAL = NudgeDeclaration("overview.overview_first", NudgeType.REFUSAL, "run journal overview first")

OVERVIEW_NUDGES = [OVERVIEW_REFUSAL]
