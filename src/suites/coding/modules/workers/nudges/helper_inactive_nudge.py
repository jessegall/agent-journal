from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class HelperInactiveNudge(NudgeDeclaration):
    """The nudge workers.helper_inactive."""

    key = "workers.helper_inactive"
    type = NudgeType.STEERING
    text = "{name}:{agent} used no tool for {minutes} min{queue}: {action}"
    turn_limited = False
    wakes_agent = True
