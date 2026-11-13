from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType

BEHIND_SOURCE = "behind worktrees"
FAST_FORWARDED = NudgeDeclaration("workers.worktree_fast_forwarded", NudgeType.STEERING,
    "your worktree moved up to its base branch; nothing of yours was touched", turn_limited=False)
BEHIND_FOR_MERGER = NudgeDeclaration("workers.worktree_behind", NudgeType.STEERING,
    "worker:{worker} is {count} commits behind its base branch", turn_limited=False, wakes_agent=True)
BEHIND_FOR_MAIN_AGENT = NudgeDeclaration("workers.worktree_behind_main", NudgeType.STEERING,
    "worker:{worker} is {count} commits behind, too far to leave to the merger: decide whether it updates", turn_limited=False, wakes_agent=True)
UPDATE_FAILED_FOR_MERGER = NudgeDeclaration("workers.worktree_update_failed", NudgeType.STEERING,
    "worker:{worker} update failed and changed nothing: journal behind-check show {check} says why", turn_limited=False, wakes_agent=True, full_text=True)
UPDATE_ORDERED = NudgeDeclaration("workers.worktree_update_ordered", NudgeType.STEERING,
    "Your base branch moved {count} commits: update your worktree at your next stopping point.", turn_limited=False, wakes_agent=True, full_text=True)
BEHIND_PASSED = NudgeDeclaration("workers.worktree_behind_passed", NudgeType.STEERING,
    "the merger passed worker:{worker} to you with behind check {check}: decide whether it updates", turn_limited=False, wakes_agent=True, full_text=True)
BEHIND_CHOICES = NudgeDeclaration("workers.worktree_behind_choices", NudgeType.STEERING,
    "worker:{worker} is {count} commits behind: order its update, leave it or pass it", turn_limited=False, wakes_agent=True, full_text=True)
UPDATE_REMINDER = NudgeDeclaration("workers.worktree_update_reminder", NudgeType.STEERING,
    "reminder: update your worktree at your next stopping point; {count} commits behind your base branch", turn_limited=False, wakes_agent=True)
UPDATE_NOT_RUN = NudgeDeclaration("workers.worktree_update_not_run", NudgeType.STEERING,
    "worker:{worker} has not run the ordered update", turn_limited=False, wakes_agent=True)
CLASH_OPEN = NudgeDeclaration("workers.worktree_clash_open", NudgeType.STEERING,
    "worker:{worker} update left conflict markers open: read them and advise it once", turn_limited=False, wakes_agent=True, full_text=True)
CLASH_STILL_OPEN = NudgeDeclaration("workers.worktree_clash_still_open", NudgeType.STEERING,
    "worker:{worker} still has conflict markers after your advice: pass it to the main agent", turn_limited=False, wakes_agent=True, full_text=True)
BEHIND_NUDGES = [CLASH_OPEN, CLASH_STILL_OPEN, UPDATE_REMINDER, UPDATE_NOT_RUN, FAST_FORWARDED, BEHIND_FOR_MERGER, BEHIND_FOR_MAIN_AGENT, UPDATE_FAILED_FOR_MERGER, UPDATE_ORDERED, BEHIND_PASSED, BEHIND_CHOICES]
