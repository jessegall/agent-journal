from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerCommentCopyNudge(NudgeDeclaration):
    """The nudge workers.comment_copy."""

    key = "workers.comment_copy"
    type = NudgeType.STEERING
    text = "worker:{worker} also got message:{message}: act on it yourself, or leave it to the worker"
    turn_limited = False
    wakes_agent = True
