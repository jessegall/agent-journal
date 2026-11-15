from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class StopTaskNudge(NudgeDeclaration):
    """The nudge tasks.task_at_stop."""

    key = "tasks.task_at_stop"
    type = NudgeType.REFUSAL
    text = "task:{task} is in hand: continue, block it, or skip this: journal refusal skip tasks.carry-on-at-stop --reason '<why>'"
