from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerProofShortNudge(NudgeDeclaration):
    """The nudge workers.proof_short."""

    key = "workers.proof_short"
    type = NudgeType.STEERING
    text = "proof:{proof} of task:{task} is too short: read it, fix it, show it again and commit"
    turn_limited = False
