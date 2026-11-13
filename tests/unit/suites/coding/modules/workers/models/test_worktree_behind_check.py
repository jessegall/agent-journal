import pytest

from engine.errors.refusal import Refusal
from suites.coding.modules.workers.models.enums.behind_check_state import BehindCheckState as State
from suites.coding.modules.workers.models.worktree_behind_check import WorktreeBehindCheck

MERGER = 12


def check(state: State = State.OPEN) -> WorktreeBehindCheck:
    return WorktreeBehindCheck(id=1, environment_id=1, worktree_id=3, base_tip="abc", behind=4, state=state)


MOVES = {
    State.OPEN: {"ordered": State.ORDERED, "left": State.IGNORED, "passed": State.PASSED, "updated": State.UPDATED, "gone": State.REMOVED},
    State.ORDERED: {"updated": State.UPDATED, "conflicted": State.CONFLICTED, "passed": State.PASSED, "gone": State.REMOVED, "reminded": State.ORDERED},
    State.CONFLICTED: {"updated": State.UPDATED, "passed": State.PASSED, "gone": State.REMOVED, "reminded": State.CONFLICTED},
    State.PASSED: {"ordered": State.ORDERED, "left": State.IGNORED, "gone": State.REMOVED},
    State.IGNORED: {"gone": State.REMOVED},
    State.UPDATED: {},
    State.REMOVED: {},
}


def taken(row: WorktreeBehindCheck, name: str) -> WorktreeBehindCheck:
    method = getattr(row, name)
    return method(MERGER, "the reason") if name in ("ordered", "left", "passed") else method()


@pytest.mark.parametrize("state, name, target", [(state, name, target) for state, moves in MOVES.items() for name, target in moves.items()])
def test_every_allowed_move_reaches_its_state(state, name, target):
    assert taken(check(state), name).state is target


@pytest.mark.parametrize("state, name", [(state, name) for state, moves in MOVES.items() for name in ("ordered", "left", "passed", "updated", "conflicted", "gone", "reminded") if name not in moves])
def test_every_other_move_is_refused(state, name):
    with pytest.raises(Refusal, match=f"is {state}"):
        taken(check(state), name)


def test_a_pass_goes_back_to_the_main_agent_who_may_order_the_update():
    ordered = check(State.OPEN).passed(MERGER, "risky").ordered(1, "go on")
    assert (ordered.state, ordered.decided_by, ordered.reason) == (State.ORDERED, 1, "go on")


def test_an_order_holds_who_and_why_and_reminders_count():
    reminded = check().ordered(MERGER, "three commits behind").reminded().reminded()
    assert (reminded.decided_by, reminded.reason, reminded.reminders) == (MERGER, "three commits behind", 2)


def test_only_an_open_or_passed_check_waits_for_a_decision():
    assert [state for state in State if check(state).open_for_decision()] == [State.OPEN, State.PASSED]
