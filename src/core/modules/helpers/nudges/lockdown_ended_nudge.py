from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class LockdownEndedNudge(NudgeDeclaration):
    """The nudge helpers.lockdown_ended."""

    key = "helpers.lockdown_ended"
    type = NudgeType.STEERING
    text = "The usage limit ended: continue what you were doing"
    turn_limited = False
    wakes_agent = True
