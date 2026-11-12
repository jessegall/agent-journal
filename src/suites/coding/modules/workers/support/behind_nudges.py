from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType

BEHIND_SOURCE = "behind worktrees"
FAST_FORWARDED = NudgeDeclaration("workers.worktree_fast_forwarded", NudgeType.NOTICE,
    "your worktree moved to {base} at {commit}; nothing of yours was touched", turn_limited=False)
BEHIND_FOR_MERGER = NudgeDeclaration("workers.worktree_behind", NudgeType.STEERING,
    "worker:{worker} is {count} commits behind {base}: journal merger behind {worker}", turn_limited=False, wakes_agent=True)
BEHIND_FOR_MAIN_AGENT = NudgeDeclaration("workers.worktree_behind_main", NudgeType.STEERING,
    "worker:{worker} is {count} commits behind {base}, too far to leave to the merger: journal merger behind {worker}, then decide", turn_limited=False, wakes_agent=True)
BEHIND_NUDGES = [FAST_FORWARDED, BEHIND_FOR_MERGER, BEHIND_FOR_MAIN_AGENT]
