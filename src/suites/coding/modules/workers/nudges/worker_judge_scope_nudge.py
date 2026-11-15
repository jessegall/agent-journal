from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerJudgeScopeNudge(NudgeDeclaration):
    """The nudge workers.judge_scope."""

    key = "workers.judge_scope"
    type = NudgeType.REFUSAL
    text = "A worker judges only its own changes or its branch"
    turn_limited = False
