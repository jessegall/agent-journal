from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class SilentAgentContinueNudge(NudgeDeclaration):
    """The nudge workers.continue_silent_agent."""

    key = "workers.continue_silent_agent"
    type = NudgeType.STEERING
    text = "Continue your unfinished work."
    turn_limited = False
    wakes_agent = True
    repeats_without_hook = True
