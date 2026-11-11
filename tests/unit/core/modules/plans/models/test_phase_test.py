import pytest

from core.modules.plans.models.phase import Phase

TEST = "pytest tests/build.py"


def phase(test_command: str = "", checkpoint: bool = False) -> Phase:
    return Phase(id=1, plan_id=1, creator_id=1, position=1, title="Build", checkpoint=checkpoint, test_command=test_command)


@pytest.mark.parametrize("new, previous, refused", [
    (phase(TEST), None, True),
    (phase(TEST, checkpoint=True), None, False),
    (phase(), None, False),
    (phase(TEST), phase(), True),
    (phase(TEST, checkpoint=True), phase(), False),
    (phase(TEST), phase("pytest tests/other.py"), True),
], ids=["made with a test and no flag", "made as a checkpoint with a test", "made with no test", "a test added to a phase with no flag",
        "a test and the flag added in one edit", "another test on a phase with no flag"])
def test_a_new_test_command_is_refused_on_a_phase_that_is_no_checkpoint(new, previous, refused):
    assert new.is_test_refused(previous) is refused


def test_a_test_command_an_older_journal_stored_on_a_phase_with_no_flag_is_kept_through_an_edit_of_another_field():
    stored = phase(TEST)
    assert Phase(id=1, plan_id=1, creator_id=1, position=1, title="Build the cart", test_command=TEST).is_test_refused(stored) is False
