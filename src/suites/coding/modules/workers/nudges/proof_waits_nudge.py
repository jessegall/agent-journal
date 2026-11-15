from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ProofWaitsNudge(NudgeDeclaration):
    """The nudge workers.proof_waits."""

    key = "workers.proof_waits"
    type = NudgeType.STEERING
    text = 'worker:{worker} waits on your check, proofs {proofs}'
    turn_limited = False
    wakes_agent = True
