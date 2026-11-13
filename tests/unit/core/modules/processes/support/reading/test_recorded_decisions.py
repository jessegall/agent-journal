from types import SimpleNamespace

from core.modules.processes.models.enums.reading_phase import ReadingPhase
from core.modules.processes.support.reading.recorded_decisions import RecordedDecisions


class NoReads:
    """Collaborators nobody may use: any call fails the test."""

    def __getattr__(self, name: str) -> object:
        raise AssertionError(f"used {name}")


def test_a_merge_the_journal_ran_itself_keeps_no_reading_decision_and_reads_nothing():
    merge = SimpleNamespace(id=3, is_journal_merge=True)
    RecordedDecisions(NoReads(), NoReads(), NoReads(), NoReads()).store(merge, [], ReadingPhase.START, NoReads())
