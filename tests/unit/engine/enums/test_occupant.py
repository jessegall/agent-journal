import pytest

from engine.enums.occupant import Occupant


@pytest.mark.parametrize("occupant,is_cold,replaced", [
    (Occupant.CONTINUE, False, False), (Occupant.CONTINUE, True, False),
    (Occupant.COLD_ROTATION, False, False), (Occupant.COLD_ROTATION, True, True),
    (Occupant.LAUNCH_ROTATION, False, True), (Occupant.LAUNCH_ROTATION, True, True),
])
def test_an_occupant_says_whether_a_launch_replaces_its_session(occupant, is_cold, replaced):
    assert occupant.replaces(is_cold) is replaced


def test_only_an_each_launch_occupant_may_change_its_program():
    assert [occupant for occupant in Occupant if occupant.may_change_program] == [Occupant.LAUNCH_ROTATION]


def test_a_continuation_keeps_the_session_of_an_each_launch_occupant_and_leaves_the_others():
    assert [occupant.continuation for occupant in Occupant] == [Occupant.CONTINUE, Occupant.COLD_ROTATION, Occupant.CONTINUE]


def test_the_stored_words_stay_as_the_profile_files_write_them():
    assert [occupant.value for occupant in Occupant] == ["continue", "when-cold", "each-launch"]
