from core.modules.messages.support.word_distance import WordDistance


def test_the_same_words_are_fully_alike():
    assert WordDistance.similarity("The merge is done", "the merge is done.") == 1.0


def test_a_reworded_repeat_is_mostly_alike():
    first = "Merges are blocked until you accept approval card 15 or switch Auto on"
    second = "Merges stay blocked until you accept approval card 15 or turn Auto on"
    assert WordDistance.similarity(first, second) >= 0.6


def test_different_messages_are_not_alike():
    assert WordDistance.similarity("The tests pass and the fix is installed", "Worker 697 is building the browser login") < 0.6
