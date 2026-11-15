from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.line_delivery import LineDelivery
from engine.enums.nudge_type import NudgeType


class JournalStartedNudge(NudgeDeclaration):
    """The nudge drivers.journal_started."""

    key = "drivers.journal_started"
    delivery = LineDelivery.WAKE_HOOK
    type = NudgeType.STEERING
    text = "The journal started again while you were working: go on"
    turn_limited = False
    wakes_agent = True
