from datetime import timedelta

from engine.query.queries import Queries
from engine.setting.setting_values import SettingValues
from engine.time.timestamp import Timestamp
from suites.coding.modules.workers.models.enums.behind_check_state import BehindCheckState
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.models.worktree_behind_check import WorktreeBehindCheck
from suites.coding.modules.workers.models.worktree_behind_look import WorktreeBehindLook
from suites.coding.modules.workers.support.worker_settings import STALE_CHECK_MINUTES, STALE_CHECK_COMMITS, STALE_RECHECK_COMMITS, WORKTREE_UPDATES

CHECKS_REASON = "every behind check of the worktree is weighed"
CUT_WORKTREES_REASON = "every worktree that is cut is checked for how far behind it is"
ACTIVE_STATES = (BehindCheckState.OPEN, BehindCheckState.ORDERED, BehindCheckState.CONFLICTED)


class BehindChecks:
    """When a worktree of the environment in scope is looked at for how far it is behind its base, and when
    such a look opens a check: the worktrees still cut, once the minutes between looks have passed since the
    last look, and a check only at the set number of commits behind, with none open, and after a check left
    alone only once the worktree fell the recheck number of commits further behind."""

    def __init__(self, queries: Queries, settings: SettingValues) -> None:
        self.queries, self.settings = queries, settings

    def is_enabled(self) -> bool:
        return self.settings.flag(WORKTREE_UPDATES) and self.settings.number(STALE_CHECK_COMMITS) > 0

    def due_worktrees(self, now: Timestamp) -> tuple[Worktree, ...]:
        if not self.is_enabled() or not self.is_check_due(now):
            return ()
        return tuple(self.queries.query(Worktree).filter(state=WorktreeState.CUT).every_row(CUT_WORKTREES_REASON))

    def is_check_due(self, now: Timestamp) -> bool:
        check = self.last_check()
        return check is None or now.value - check.looked_at.value >= timedelta(minutes=self.settings.number(STALE_CHECK_MINUTES))

    def last_check(self) -> WorktreeBehindLook | None:
        return self.queries.query(WorktreeBehindLook).first()

    def opens(self, worktree: Worktree, behind: int) -> bool:
        if behind < self.settings.number(STALE_CHECK_COMMITS):
            return False
        checks = tuple(reversed(tuple(self.queries.query(WorktreeBehindCheck).filter(worktree_id=worktree.id).every_row(CHECKS_REASON))))
        if any(check.state in ACTIVE_STATES for check in checks):
            return False
        remaining = next((check for check in checks if check.state is BehindCheckState.IGNORED), None)
        return remaining is None or behind >= remaining.behind + self.settings.number(STALE_RECHECK_COMMITS)

    def is_passable(self, worktree: Worktree) -> bool:
        return any(check.is_passable() for check in self.queries.query(WorktreeBehindCheck).filter(worktree_id=worktree.id).every_row(CHECKS_REASON))
