from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class FocusSuggestedNudge(NudgeDeclaration):
    """The nudge plans.focus_suggested."""

    key = "plans.focus_suggested"
    type = NudgeType.NOTICE
    text = "Plans {plans} started; your default focus is plan {focus}"
    turn_limited = False
