from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class TriggerDeniesNudge(NudgeDeclaration):
    """The nudge triggers.trigger_denies."""

    key = "triggers.trigger_denies"
    type = NudgeType.REFUSAL
    text = 'trigger:{trigger} denies this'
