from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ProofCheckNudge(NudgeDeclaration):
    """The nudge workers.check_the_proof."""

    key = "workers.check_the_proof"
    type = NudgeType.REFUSAL
    text = "worker:{worker} committed task:{task}, proofs {proofs}: check them"
