from engine.command.context import Context
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.repository.repository import Repository
from suites.coding.modules.workers.models.enums.behind_check_state import BehindCheckState
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.models.worktree_behind_check import WorktreeBehindCheck
from suites.coding.modules.workers.support.behind_checks import CHECKS_REASON

UPDATABLE_STATES = (BehindCheckState.OPEN, BehindCheckState.ORDERED, BehindCheckState.CONFLICTED)
CONFLICTABLE_STATES = (BehindCheckState.OPEN, BehindCheckState.ORDERED)
REMOVABLE_STATES = (BehindCheckState.OPEN, BehindCheckState.ORDERED, BehindCheckState.CONFLICTED, BehindCheckState.PASSED)


class BehindCheckClosing:
    """Closes the checks of a worktree as what happened to it says: brought up to date by a commit or an
    update, clashing when an update left markers, gone when the worktree left its cut state; an update that
    failed is noted on an open or ordered check, which stays as it was. A closed check is left as it is."""

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def close_updated(self, worktree: Worktree, context: Context) -> None:
        for check in self.checks(worktree, UPDATABLE_STATES):
            self.repository.save_change(check, check.updated(), context)

    def conflicted(self, worktree: Worktree, context: Context) -> None:
        for check in self.checks(worktree, CONFLICTABLE_STATES):
            self.repository.save_change(check, check.conflicted(), context)

    def failed(self, worktree: Worktree, reason: str, context: Context) -> tuple[WorktreeBehindCheck, ...]:
        return tuple(self.repository.save_change(check, check.failed(reason), context) for check in self.checks(worktree, CONFLICTABLE_STATES))

    def close_removed(self, worktree: Worktree, context: Context) -> None:
        for check in self.checks(worktree, REMOVABLE_STATES):
            self.repository.save_change(check, check.gone(), context)

    def checks(self, worktree: Worktree, states: tuple[BehindCheckState, ...]) -> tuple[WorktreeBehindCheck, ...]:
        return tuple(self.queries.query(WorktreeBehindCheck).filter(worktree_id=worktree.id).matching(Among("state", states)).every_row(CHECKS_REASON))
