from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class SafeguardsStoppedNudge(NudgeDeclaration):
    """The nudge drivers.safeguards_stopped."""

    key = "drivers.safeguards_stopped"
    type = NudgeType.STEERING
    text = "An API safeguards error ended your last turn: continue your work"
    turn_limited = False
    wakes_agent = True
