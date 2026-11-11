import pytest

from engine.errors.refusal import Refusal
from core.modules.plans.models.phase import Phase
from suites.coding.modules.workers.support.phase_test_deferral_rules import PhaseTestDeferralRules

LATER_STORIES = "tests/stories/compaction_never_twice.py"
COMMAND = f"pytest tests/cart.py {LATER_STORIES}"
FAILED = tuple([LATER_STORIES])
RULES = PhaseTestDeferralRules(limit=2)


def phase(checkpoint: bool = True, test_command: str = COMMAND) -> Phase:
    return Phase(id=7, plan_id=1, creator_id=1, position=1, title="Build", checkpoint=checkpoint, test_command=test_command)


def test_failed_paths_of_a_checkpoints_own_test_are_left_out_while_a_later_task_waits():
    assert RULES.check(phase(), FAILED, FAILED, waiting_task_count=1, deferred_count=1).text() == "pytest tests/cart.py"


@pytest.mark.parametrize("checked_phase, failed_paths, paths, waiting_task_count, deferred_count, words", [
    (phase(checkpoint=False), FAILED, FAILED, 1, 0, "phase 7 is not a checkpoint: it runs no test"),
    (phase(test_command=""), FAILED, FAILED, 1, 0, "phase 7 is not a checkpoint: it runs no test"),
    (phase(), FAILED, FAILED, 0, 0, "nothing after phase 7 is left to wait for: the failure is real, fix it"),
    (phase(), FAILED, FAILED, 1, 2, "2 of 2 deferrals are used for phase 7"),
    (phase(), None, FAILED, 1, 0, "the own test of phase 7 did not fail: nothing to correct"),
    (phase(), FAILED, tuple(["tests/cart.py"]), 1, 0, "tests/cart.py did not fail in the own test of phase 7"),
    (phase(), ("tests/cart.py", LATER_STORIES), ("tests/cart.py", LATER_STORIES), 1, 0, "the test command would be left with no path"),
    (phase(test_command="pytest tests/cart.py tests/stories"), FAILED, FAILED, 1, 0, "is not a path of the test command"),
], ids=["a phase with no flag", "a checkpoint with no test", "no later task waits, the own task of the worker does not count", "the deferrals are used",
        "the own test passed", "a path that passed", "every path", "a path the command does not name as a whole word"])
def test_each_reason_refuses_a_deferral_with_words_of_its_own(checked_phase, failed_paths, paths, waiting_task_count, deferred_count, words):
    with pytest.raises(Refusal) as refusal:
        RULES.check(checked_phase, failed_paths, paths, waiting_task_count, deferred_count)
    assert words in refusal.value.reason
