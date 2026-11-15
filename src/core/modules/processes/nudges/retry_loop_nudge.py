from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class RetryLoopNudge(NudgeDeclaration):
    """The nudge processes.retry_loop."""

    key = "processes.retry_loop"
    type = NudgeType.REFUSAL
    text = "No retry loops: run the command once and read its error"
