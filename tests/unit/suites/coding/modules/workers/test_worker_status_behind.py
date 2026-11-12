import pytest

from suites.coding.modules.workers.models.enums.behind_check_state import BehindCheckState as State
from suites.coding.modules.workers.models.worktree_behind_check import WorktreeBehindCheck


def check(state: State) -> WorktreeBehindCheck:
    return WorktreeBehindCheck(id=1, environment_id=1, worktree_id=1, base_tip="abc", behind=4, state=state, reason="different area")


@pytest.mark.parametrize("state, text", [(State.OPEN, "waiting for a decision"), (State.ORDERED, "update ordered by the merger: different area"),
                                         (State.PASSED, "passed to the main agent: different area"), (State.LEFT, "left alone by the merger: different area"),
                                         (State.CONFLICTED, "the update clashed: settle the markers, then commit"), (State.UPDATED, ""), (State.GONE, "")])
def test_worker_status_shows_where_the_decision_about_the_worktree_stands(state, text):
    assert check(state).decision_text("the merger") == text
