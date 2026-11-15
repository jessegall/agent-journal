from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WeighFirstNudge(NudgeDeclaration):
    """The nudge memories.weigh_first."""

    key = "memories.weigh_first"
    type = NudgeType.REFUSAL
    text = "Weigh your memories first, or skip the weighing with a reason"
