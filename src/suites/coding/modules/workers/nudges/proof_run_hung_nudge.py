from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ProofRunHungNudge(NudgeDeclaration):
    """The nudge workers.proof_run_stuck."""

    key = "workers.proof_run_stuck"
    type = NudgeType.STEERING
    text = 'worker:{worker} proof {proof}: the test run went past {minutes} minutes and was ended as stuck, output {output}'
    turn_limited = False
    wakes_agent = True
