from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WaitingItemsNudge(NudgeDeclaration):
    """The nudge coding.waiting_items."""

    key = "coding.waiting_items"
    type = NudgeType.STEERING
    text = "Waiting on you: {items}"
