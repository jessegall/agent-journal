from engine.command.context import Context
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.repository.repository import Repository
from suites.coding.modules.workers.models.enums.behind_check_state import BehindCheckState
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.models.worktree_behind_check import WorktreeBehindCheck

UPDATED_FROM = (BehindCheckState.OPEN, BehindCheckState.ORDERED, BehindCheckState.CONFLICTED)
CONFLICTED_FROM = (BehindCheckState.OPEN, BehindCheckState.ORDERED)
GONE_FROM = (BehindCheckState.OPEN, BehindCheckState.ORDERED, BehindCheckState.CONFLICTED, BehindCheckState.PASSED)


class BehindCheckClosing:
    """Closes the checks of a worktree as what happened to it says: brought up to date by a commit or an update,
    clashing when an update left markers, gone when the worktree left its cut state. A closed check is left as it is."""

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def close_updated(self, worktree: Worktree, context: Context) -> None:
        for check in self.checks(worktree, UPDATED_FROM):
            self.repository.save_change(check, check.updated(), context)

    def conflicted(self, worktree: Worktree, context: Context) -> None:
        for check in self.checks(worktree, CONFLICTED_FROM):
            self.repository.save_change(check, check.conflicted(), context)

    def close_gone(self, worktree: Worktree, context: Context) -> None:
        for check in self.checks(worktree, GONE_FROM):
            self.repository.save_change(check, check.gone(), context)

    def checks(self, worktree: Worktree, states: tuple[BehindCheckState, ...]) -> tuple[WorktreeBehindCheck, ...]:
        return tuple(self.queries.query(WorktreeBehindCheck).filter(worktree_id=worktree.id).matching(Among("state", states)).all_rows())
