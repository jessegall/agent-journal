from engine.enums.occupant import Occupant
from suites.coding.support.shipped_profiles import HELPER_PROFILES

MERGER = next(profile for profile in HELPER_PROFILES if profile.name == "journal-merger")


def test_the_merger_gets_a_new_session_at_each_launch():
    assert MERGER.occupant is Occupant.LAUNCH_ROTATION


def test_the_merger_is_told_to_read_its_memories_and_to_write_one_after_each_advice():
    assert all(phrase in MERGER.body for phrase in ("journal memory list", "journal memory make", "one memory"))


def test_the_merger_keeps_its_program_choice():
    assert (MERGER.model, MERGER.codex_model) == ("sonnet", "gpt-6.1-sol")
