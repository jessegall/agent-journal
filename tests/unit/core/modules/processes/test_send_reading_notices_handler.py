from types import SimpleNamespace

from core.modules.processes.commands.send_reading_notices.send_reading_notices import SendReadingNotices
from core.modules.processes.commands.send_reading_notices.send_reading_notices_handler import SendReadingNoticesHandler

MERGE = SimpleNamespace(id=3, session_agent_id=2, is_journal_merge=True)


class NoReads:
    """Collaborators nobody may use: any call fails the test."""

    def __getattr__(self, name: str) -> object:
        raise AssertionError(f"used {name}")


class MergeRows:
    """The rows of one merge the journal ran itself."""

    def required(self, model: type, row_id: int) -> SimpleNamespace:
        return MERGE


def test_a_merge_the_journal_ran_itself_gets_no_reading_notice_and_reads_no_part():
    handler = SendReadingNoticesHandler(MergeRows(), NoReads(), NoReads(), NoReads(), NoReads(), NoReads())
    handler.handle(SendReadingNotices(MERGE.id), NoReads())
