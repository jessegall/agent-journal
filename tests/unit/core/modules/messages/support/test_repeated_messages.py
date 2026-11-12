from core.modules.messages.support.repeated_messages import RepeatedMessages
from tests.unit.core.modules.messages.repeated_message_pairs import DIFFERENT, REPEATS


def stored(pairs: list[tuple[str, str]]) -> int:
    return sum(RepeatedMessages.repeats_previous(previous, text) for previous, text in pairs)


def test_most_real_repeats_from_the_journal_are_held():
    assert stored(REPEATS) >= 10, f"{stored(REPEATS)} of {len(REPEATS)} repeats held"


def test_few_real_messages_on_another_subject_are_held():
    assert stored(DIFFERENT) <= 4, f"{stored(DIFFERENT)} of {len(DIFFERENT)} different messages held"


def test_a_new_number_is_something_new():
    assert not RepeatedMessages.repeats_previous("The worker has task 7246 and its tests passed.", "The worker has task 7247 and its tests passed.")


def test_the_same_words_are_a_repeat():
    assert RepeatedMessages.repeats_previous("The merge is done and installed.", "the merge is done, and installed")


def test_two_messages_on_one_subject_with_their_points_in_a_different_order_are_no_repeat():
    previous, text = DIFFERENT[-1]
    assert not RepeatedMessages.repeats_previous(previous, text)


def test_a_reworded_message_keeps_its_points_in_about_the_same_place_and_is_a_repeat():
    assert RepeatedMessages.repeats_previous("Merges are blocked until you accept approval card 15 or switch Auto on", "Merges stay blocked until you accept approval card 15 or turn Auto on")
