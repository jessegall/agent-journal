from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType

STALE_SOURCE = "behind worktrees"
FAST_FORWARDED = NudgeDeclaration("workers.worktree_fast_forwarded", NudgeType.STEERING,
    "your worktree moved up to its base branch; nothing of yours was touched", turn_limited=False)
MERGER_STALE_WORKTREE = NudgeDeclaration("workers.worktree_behind", NudgeType.STEERING,
    "worker:{worker} is {count} commits behind its base branch", turn_limited=False, wakes_agent=True)
MAIN_AGENT_STALE_WORKTREE = NudgeDeclaration("workers.worktree_behind_main", NudgeType.STEERING,
    "worker:{worker} is {count} commits behind, too far to leave to the merger: decide whether it updates", turn_limited=False, wakes_agent=True)
MERGER_UPDATE_FAILED = NudgeDeclaration("workers.worktree_update_failed", NudgeType.STEERING,
    "worker:{worker} update failed and changed nothing: journal behind-check show {check} says why", turn_limited=False, wakes_agent=True, full_text=True)
UPDATE_ORDERED = NudgeDeclaration("workers.worktree_update_ordered", NudgeType.STEERING,
    "Your base branch moved {count} commits: update your worktree at your next stopping point.", turn_limited=False, wakes_agent=True, full_text=True)
STALE_PASSED = NudgeDeclaration("workers.worktree_behind_passed", NudgeType.STEERING,
    "the merger passed worker:{worker} to you with behind check {check}: decide whether it updates", turn_limited=False, wakes_agent=True, full_text=True)
STALE_CHOICES = NudgeDeclaration("workers.worktree_behind_choices", NudgeType.STEERING,
    "worker:{worker} is {count} commits behind: order its update, leave it or pass it", turn_limited=False, wakes_agent=True, full_text=True)
UPDATE_REMINDER = NudgeDeclaration("workers.worktree_update_reminder", NudgeType.STEERING,
    "reminder: update your worktree at your next stopping point; {count} commits behind your base branch", turn_limited=False, wakes_agent=True)
UPDATE_SKIPPED = NudgeDeclaration("workers.worktree_update_not_run", NudgeType.STEERING,
    "worker:{worker} has not run the ordered update", turn_limited=False, wakes_agent=True)
CONFLICT_OPEN = NudgeDeclaration("workers.worktree_clash_open", NudgeType.STEERING,
    "worker:{worker} update left conflict markers open: read them and advise it once", turn_limited=False, wakes_agent=True, full_text=True)
CONFLICT_REPEATED = NudgeDeclaration("workers.worktree_clash_still_open", NudgeType.STEERING,
    "worker:{worker} still has conflict markers after your advice: pass it to the main agent", turn_limited=False, wakes_agent=True, full_text=True)
STALE_NUDGES = [CONFLICT_OPEN, CONFLICT_REPEATED, UPDATE_REMINDER, UPDATE_SKIPPED, FAST_FORWARDED, MERGER_STALE_WORKTREE, MAIN_AGENT_STALE_WORKTREE, MERGER_UPDATE_FAILED, UPDATE_ORDERED, STALE_PASSED, STALE_CHOICES]
