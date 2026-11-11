import pytest

from suites.coding.modules.workers.models.enums.ask_outcome import AskOutcome
from suites.coding.modules.workers.models.merger_line import MergerLine

QUESTION = MergerLine(text="worker 4 asks", fallback_source="workers.ask", worker_id=4)


def test_a_question_ends_in_one_of_four_ways():
    assert [outcome.value for outcome in AskOutcome] == ["answered", "fixed", "forwarded", "moot"]


@pytest.mark.parametrize("outcome", list(AskOutcome))
def test_every_outcome_gives_the_worker_a_line_with_the_words(outcome):
    assert "use the other fixture" in outcome.worker_line("use the other fixture")


def test_each_outcome_has_its_own_line_and_its_own_description():
    assert len({outcome.worker_line("x") for outcome in AskOutcome}) == len(AskOutcome)
    assert AskOutcome.FORWARDED.description() == "passed on"


@pytest.mark.parametrize("outcome", list(AskOutcome))
def test_a_line_with_an_outcome_is_no_longer_an_open_question(outcome):
    assert QUESTION.is_open_question()
    assert not MergerLine(text="worker 4 asks", fallback_source="workers.ask", worker_id=4, outcome=outcome).is_open_question()


def test_a_line_with_no_worker_is_not_a_question():
    assert not MergerLine(text="a worker merged", fallback_source="workers.merge").is_open_question()
