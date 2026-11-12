from types import SimpleNamespace

from core.modules.processes.commands.end_process.end_process_handler import EndProcessHandler
from core.modules.processes.support.run_visibility import RunVisibility


class NoReads:
    """Collaborators nobody may use: any call fails the test."""

    def __getattr__(self, name: str) -> object:
        raise AssertionError(f"used {name}")


def test_a_merge_the_journal_ran_itself_takes_the_code_its_line_gave_without_reading_its_parts():
    handler = EndProcessHandler(NoReads(), NoReads(), NoReads(), NoReads(), RunVisibility(NoReads(), NoReads()))
    assert handler.failed_test_code(SimpleNamespace(id=3, is_journal_merge=True)) == 0
