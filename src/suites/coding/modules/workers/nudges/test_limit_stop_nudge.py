from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class TestLimitStopNudge(NudgeDeclaration):
    """The nudge processes.run_over_test_limit."""

    key = "processes.run_over_test_limit"
    type = NudgeType.STEERING
    text = "Output {output} stopped: {count} tests, limit {limit}. Run only what proves your change; proofs run at hand-in"
    wakes_agent = True
