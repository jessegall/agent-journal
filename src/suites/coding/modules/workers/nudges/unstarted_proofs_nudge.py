from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class UnstartedProofsNudge(NudgeDeclaration):
    """The nudge workers.proofs_not_started."""

    key = "workers.proofs_not_started"
    type = NudgeType.STEERING
    text = "Proofs {proofs} are queued {minutes} min and not started; last error of the tick: {exception}"
    turn_limited = False
    wakes_agent = True
