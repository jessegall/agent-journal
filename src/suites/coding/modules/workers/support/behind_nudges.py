from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType

BEHIND_SOURCE = "behind worktrees"
FAST_FORWARDED = NudgeDeclaration("workers.worktree_fast_forwarded", NudgeType.STEERING,
    "your worktree moved to {base} at {commit}; nothing of yours was touched", turn_limited=False)
BEHIND_FOR_MERGER = NudgeDeclaration("workers.worktree_behind", NudgeType.STEERING,
    "worker:{worker} is {count} commits behind {base}: journal merger behind {worker}", turn_limited=False, wakes_agent=True)
BEHIND_FOR_MAIN_AGENT = NudgeDeclaration("workers.worktree_behind_main", NudgeType.STEERING,
    "worker:{worker} is {count} commits behind {base}, too far to leave to the merger: journal merger behind {worker}, then decide", turn_limited=False, wakes_agent=True)
UPDATE_FAILED_FOR_MERGER = NudgeDeclaration("workers.worktree_update_failed", NudgeType.STEERING,
    "worker:{worker} update failed and changed nothing: {reason}", turn_limited=False, wakes_agent=True, full_text=True)
UPDATE_ORDERED = NudgeDeclaration("workers.worktree_update_ordered", NudgeType.STEERING,
    "The base branch moved {count} commits and touches {files} you work on. Run journal worker update when you are at a stopping point.", turn_limited=False, wakes_agent=True, full_text=True)
BEHIND_PASSED = NudgeDeclaration("workers.worktree_behind_passed", NudgeType.STEERING,
    "worker:{worker} is {count} behind {base}, {overlap} files overlap, model {model}: the merger thinks {reason}. Decide with journal worker update {worker} or journal merger leave {worker} --why", turn_limited=False, wakes_agent=True, full_text=True)
BEHIND_CHOICES = NudgeDeclaration("workers.worktree_behind_choices", NudgeType.STEERING,
    "worker:{worker} is {count} commits behind {base}: journal merger behind {worker}, then journal worker update {worker}, journal merger leave {worker} --why, or journal merger pass {worker}", turn_limited=False, wakes_agent=True, full_text=True)
UPDATE_REMINDER = NudgeDeclaration("workers.worktree_update_reminder", NudgeType.STEERING,
    "reminder: run journal worker update when you are at a stopping point; {count} commits behind {base}", turn_limited=False, wakes_agent=True)
UPDATE_NOT_RUN = NudgeDeclaration("workers.worktree_update_not_run", NudgeType.STEERING,
    "worker:{worker} has not run the ordered update", turn_limited=False, wakes_agent=True)
BEHIND_NUDGES = [UPDATE_REMINDER, UPDATE_NOT_RUN, FAST_FORWARDED, BEHIND_FOR_MERGER, BEHIND_FOR_MAIN_AGENT, UPDATE_FAILED_FOR_MERGER, UPDATE_ORDERED, BEHIND_PASSED, BEHIND_CHOICES]
