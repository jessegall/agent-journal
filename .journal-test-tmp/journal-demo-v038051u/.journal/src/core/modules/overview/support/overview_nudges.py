from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

OVERVIEW_COMMAND = "journal overview"
OVERVIEW_REFUSAL = NudgeDeclaration("overview.overview_first", NudgeType.REFUSAL, "run journal overview first")

OVERVIEW_LINE = NudgeDeclaration("overview.run_overview", NudgeType.STEERING, "run journal overview", turn_limited=False)

OVERVIEW_NUDGES = [OVERVIEW_REFUSAL, OVERVIEW_LINE]
