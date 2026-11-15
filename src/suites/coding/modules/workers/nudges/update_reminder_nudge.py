from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class UpdateReminderNudge(NudgeDeclaration):
    """The nudge workers.worktree_update_reminder."""

    key = "workers.worktree_update_reminder"
    type = NudgeType.STEERING
    text = "reminder: update your worktree at your next stopping point; {count} commits behind your base branch"
    turn_limited = False
    wakes_agent = True
