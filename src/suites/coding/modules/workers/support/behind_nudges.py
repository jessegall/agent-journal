from suites.coding.modules.workers.nudges.fast_forwarded_nudge import FastForwardedNudge
from suites.coding.modules.workers.nudges.merger_stale_worktree_nudge import MergerStaleWorktreeNudge
from suites.coding.modules.workers.nudges.main_agent_stale_worktree_nudge import MainAgentStaleWorktreeNudge
from suites.coding.modules.workers.nudges.merger_update_failed_nudge import MergerUpdateFailedNudge
from suites.coding.modules.workers.nudges.update_ordered_nudge import UpdateOrderedNudge
from suites.coding.modules.workers.nudges.stale_passed_nudge import StalePassedNudge
from suites.coding.modules.workers.nudges.stale_choices_nudge import StaleChoicesNudge
from suites.coding.modules.workers.nudges.update_reminder_nudge import UpdateReminderNudge
from suites.coding.modules.workers.nudges.update_skipped_nudge import UpdateSkippedNudge
from suites.coding.modules.workers.nudges.conflict_open_nudge import ConflictOpenNudge
from suites.coding.modules.workers.nudges.conflict_repeated_nudge import ConflictRepeatedNudge

STALE_SOURCE = "behind worktrees"
STALE_NUDGES = [ConflictOpenNudge, ConflictRepeatedNudge, UpdateReminderNudge, UpdateSkippedNudge, FastForwardedNudge, MergerStaleWorktreeNudge, MainAgentStaleWorktreeNudge, MergerUpdateFailedNudge, UpdateOrderedNudge, StalePassedNudge, StaleChoicesNudge]
