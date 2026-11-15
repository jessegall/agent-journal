from engine.provider.enums.wake_answer import WakeAnswer


def test_the_two_answers_have_plain_values():
    assert [answer.value for answer in WakeAnswer] == ["exit_with_stderr", "block_with_reason"]
