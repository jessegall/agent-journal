from suites.coding.modules.workers.models.enums.behind_check_state import BehindCheckState as State
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.models.worktree_behind_check import WorktreeBehindCheck
from suites.coding.modules.workers.support.behind_check_closing import BehindCheckClosing

WORKTREE = Worktree(id=1, environment_id=1, session_agent_id=7, task_id=1, creator_id=1, folder="/work", branch="workers/one", base_branch="version-5", state=WorktreeState.CUT)


class Store:
    """The checks of one worktree, read and changed as the query and the repository do."""

    def __init__(self, *states: State) -> None:
        self.rows = {number: WorktreeBehindCheck(id=number, environment_id=1, worktree_id=1, base_tip="abc", commits_lagging=3, state=state) for number, state in enumerate(states, 1)}
        self.condition = None

    def query(self, model: type) -> "Store":
        return self

    def filter(self, **values: object) -> "Store":
        return self

    def matching(self, condition) -> "Store":
        self.condition = condition
        return self

    def every_row(self, reason: str) -> list[WorktreeBehindCheck]:
        return [row for row in self.rows.values() if row.state in self.condition.values]

    def save_change(self, row, changed, context):
        self.rows[row.id] = changed
        return changed

    def states(self) -> list[State]:
        return [row.state for row in self.rows.values()]


def closing(store: Store) -> BehindCheckClosing:
    return BehindCheckClosing(store, store)


def test_a_commit_or_a_clean_update_closes_an_open_or_ordered_check_as_updated():
    store = Store(State.OPEN, State.ORDERED)
    closing(store).close_updated(WORKTREE, None)
    assert store.states() == [State.UPDATED, State.UPDATED]


def test_an_update_with_markers_moves_an_ordered_check_to_conflicted_and_the_settling_commit_then_closes_it():
    store = Store(State.ORDERED)
    closing(store).conflicted(WORKTREE, None)
    assert store.states() == [State.CONFLICTED]
    closing(store).close_updated(WORKTREE, None)
    assert store.states() == [State.UPDATED]


def test_a_worktree_that_leaves_its_cut_state_closes_any_of_its_checks_as_gone():
    store = Store(State.OPEN, State.ORDERED, State.CONFLICTED, State.PASSED)
    closing(store).close_removed(WORKTREE, None)
    assert store.states() == [State.REMOVED] * 4


def test_a_closed_check_is_not_touched_again():
    store = Store(State.UPDATED, State.IGNORED, State.REMOVED)
    closing(store).close_updated(WORKTREE, None)
    closing(store).conflicted(WORKTREE, None)
    assert store.states() == [State.UPDATED, State.IGNORED, State.REMOVED]
