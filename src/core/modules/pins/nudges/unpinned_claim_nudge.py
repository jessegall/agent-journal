from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.nudge_type import NudgeType


class UnpinnedClaimNudge(NudgeDeclaration):
    """The nudge pins.pin_claimed_unmade."""

    key = "pins.pin_claimed_unmade"
    type = NudgeType.STEERING
    text = "You mentioned a pinned link but made none: pin it or drop the mention"
    interval = Interval(Seconds(300))
