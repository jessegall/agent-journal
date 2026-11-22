from engine.performance.measure_answer import MeasureAnswer


def test_the_marks_are_read_once_a_second_and_again_after_a_forget():
    answer, reads = MeasureAnswer(), []

    def measured() -> bool:
        reads.append(True)
        return True

    assert answer.answer(100.0, measured) and answer.answer(100.5, measured)
    assert len(reads) == 1
    answer.answer(101.0, measured)
    assert len(reads) == 2
    answer.forget()
    answer.answer(101.1, measured)
    assert len(reads) == 3


def test_an_answer_read_across_a_forget_is_not_kept():
    answer = MeasureAnswer()

    def measured_while_forgotten() -> bool:
        answer.forget()
        return False

    assert answer.answer(100.0, measured_while_forgotten) is False
    assert answer.answer(100.1, lambda: True) is True
