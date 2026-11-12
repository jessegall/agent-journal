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
    "worker:{worker} update failed and changed nothing: {reason}", turn_limited=False, wakes_agent=True)
UPDATE_ORDERED = NudgeDeclaration("workers.worktree_update_ordered", NudgeType.STEERING,
    "The base branch moved {count} commits and touches {files} you work on. Run journal worker update when you are at a stopping point.", turn_limited=False, wakes_agent=True)
BEHIND_NUDGES = [FAST_FORWARDED, BEHIND_FOR_MERGER, BEHIND_FOR_MAIN_AGENT, UPDATE_FAILED_FOR_MERGER, UPDATE_ORDERED]
