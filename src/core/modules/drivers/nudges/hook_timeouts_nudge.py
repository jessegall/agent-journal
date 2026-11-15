from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class HookTimeoutsNudge(NudgeDeclaration):
    """The nudge drivers.hooks_timed_out."""

    key = "drivers.hooks_timed_out"
    type = NudgeType.STEERING
    text = "agent {agent} hit {count} hook timeouts in 10 min: its chat mark names the slowest rule"
    turn_limited = False
    wakes_agent = True
