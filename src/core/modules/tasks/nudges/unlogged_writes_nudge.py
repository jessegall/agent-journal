from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class UnloggedWritesNudge(NudgeDeclaration):
    """The nudge tasks.unlogged_writes."""

    key = "tasks.unlogged_writes"
    type = NudgeType.REFUSAL
    text = "Log task {task} now: 0 writes left"
