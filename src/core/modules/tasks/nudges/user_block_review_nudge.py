from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class UserBlockReviewNudge(NudgeDeclaration):
    """The nudge tasks.user_block_review."""

    key = "tasks.user_block_review"
    type = NudgeType.NOTICE
    text = "Task {task} waits on the user: tell them what is still needed"
    turn_limited = False
    plural_text = 'tasks {task} wait on the user: tell the user what is still needed'
    id_field = "task"
