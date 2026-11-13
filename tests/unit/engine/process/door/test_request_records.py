import pytest

from engine.cli.errors.usage_error import UsageError
from engine.enums.process_kind import ProcessKind
from engine.errors.missing_file_refusal import MissingFileRefusal
from engine.errors.refusal import Refusal
from engine.process.door.request_records import RequestRecords


class KeptRecords(RequestRecords):
    """Keeps each row it is asked to write, and fails the write when told to."""

    def __init__(self, broken: bool = False) -> None:
        self.broken = broken
        self.rows: list[tuple[str, int]] = []
        self.failures: list[tuple[str, str]] = []

    def ended_now(self, category: ProcessKind, line: str, exit_code: int) -> None:
        if self.broken:
            raise OSError("the row cannot be written")
        self.rows.append((line, exit_code))

    def write_failed(self, line: str, failure: Exception) -> None:
        self.failures.append((line, str(failure)))


def raising(error: BaseException):
    def answer() -> int:
        raise error
    return answer


def test_a_command_that_answers_is_recorded_with_its_exit_code():
    records = KeptRecords()
    assert (records.recorded(ProcessKind.JOURNAL, "journal task", lambda: 0), records.rows) == (0, [("journal task", 0)])


def test_a_command_that_raised_a_refusal_is_recorded_with_the_code_of_the_refusal_and_the_refusal_goes_on():
    records = KeptRecords()
    refusal = MissingFileRefusal("no such file")
    with pytest.raises(MissingFileRefusal) as raised:
        records.recorded(ProcessKind.JOURNAL, "journal doc", raising(refusal))
    assert (raised.value is refusal, records.rows, MissingFileRefusal.exit_code) == (True, [("journal doc", 4)], 4)


def test_a_command_that_raised_a_plain_refusal_is_recorded_as_refused():
    records = KeptRecords()
    with pytest.raises(Refusal):
        records.recorded(ProcessKind.JOURNAL, "journal task", raising(Refusal("not now")))
    assert records.rows == [("journal task", 1)]


def test_a_command_that_raised_a_usage_error_is_recorded_with_the_usage_code():
    records = KeptRecords()
    with pytest.raises(UsageError):
        records.recorded(ProcessKind.JOURNAL, "journal nothing", raising(UsageError("no such model")))
    assert records.rows == [("journal nothing", 2)]


def test_a_command_that_raised_an_unexpected_error_is_recorded_with_the_error_code():
    records = KeptRecords()
    with pytest.raises(ValueError):
        records.recorded(ProcessKind.JOURNAL, "journal task", raising(ValueError("broken")))
    assert records.rows == [("journal task", 3)]


def test_a_row_that_cannot_be_written_is_reported_and_neither_the_answer_nor_the_original_error_changes():
    records = KeptRecords(broken=True)
    answer = records.recorded(ProcessKind.JOURNAL, "journal task", lambda: 0)
    with pytest.raises(Refusal, match="not now"):
        records.recorded(ProcessKind.JOURNAL, "journal doc", raising(Refusal("not now")))
    assert (answer, records.failures) == (0, [("journal task", "the row cannot be written"), ("journal doc", "the row cannot be written")])
