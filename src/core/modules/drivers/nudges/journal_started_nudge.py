from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class JournalStartedNudge(NudgeDeclaration):
    """The nudge drivers.journal_started."""

    key = "drivers.journal_started"
    type = NudgeType.STEERING
    text = "The journal started: continue your work"
    turn_limited = False
    wakes_agent = True
