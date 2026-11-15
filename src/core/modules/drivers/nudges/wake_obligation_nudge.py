from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WakeObligationNudge(NudgeDeclaration):
    """The nudge drivers.wake: the one line the wake delivery owner gives an agent whose work needs it."""

    key = "drivers.wake"
    type = NudgeType.STEERING
    text = "Work waits for you: read journal overview and go on with it"
    turn_limited = False
    wakes_agent = True
