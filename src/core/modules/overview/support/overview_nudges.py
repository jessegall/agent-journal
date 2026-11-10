from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType

OVERVIEW_COMMAND = "journal overview"
OVERVIEW_REFUSAL = NudgeDeclaration("overview.overview_first", NudgeType.REFUSAL, "read the overview first")

OVERVIEW_LINE = NudgeDeclaration("overview.run_overview", NudgeType.STEERING, "read the overview", turn_limited=False)

OVERVIEW_NUDGES = [OVERVIEW_REFUSAL, OVERVIEW_LINE]
