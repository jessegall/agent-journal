from core.modules.messages.support.repeated_messages import RepeatedMessages
from tests.unit.core.modules.messages.repeated_message_pairs import DIFFERENT, REPEATS


def held(pairs: list[tuple[str, str]]) -> int:
    return sum(RepeatedMessages.says_nothing_new(earlier, text) for earlier, text in pairs)


def test_most_real_repeats_from_the_journal_are_held():
    assert held(REPEATS) >= 11, f"{held(REPEATS)} of {len(REPEATS)} repeats held"


def test_few_real_messages_on_another_subject_are_held():
    assert held(DIFFERENT) <= 4, f"{held(DIFFERENT)} of {len(DIFFERENT)} different messages held"


def test_a_new_number_is_something_new():
    assert not RepeatedMessages.says_nothing_new("The worker has task 7246 and its tests passed.", "The worker has task 7247 and its tests passed.")


def test_the_same_words_are_a_repeat():
    assert RepeatedMessages.says_nothing_new("The merge is done and installed.", "the merge is done, and installed")
