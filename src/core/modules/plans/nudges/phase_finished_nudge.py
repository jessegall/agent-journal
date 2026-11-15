from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class PhaseFinishedNudge(NudgeDeclaration):
    """The nudge plans.phase_finished."""

    key = "plans.phase_finished"
    type = NudgeType.STEERING
    text = "plan {plan}: phase {phase} done"
    turn_limited = False
