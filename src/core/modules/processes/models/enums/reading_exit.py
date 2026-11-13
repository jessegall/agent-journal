from enum import StrEnum


class ReadingExit(StrEnum):
    """A way an agent gets past what the engine asks of it."""

    COMPLY = "comply"
    COUNT_TESTS = "count the tests"
    SKIP_WITH_REASON = "skip with a reason"
    DECLARE_UNREADABLE = "declare unreadable"
    READ_OUTPUT = "read the output"
    STOP_RUN = "stop the run"
    CLASSIFY = "classify the command"
    EXPIRES = "the block expires"
    PERSON_RELEASES = "a user releases it"
    MAIN_AGENT_HELPS = "the main agent helps"

    @property
    def needs_other_party(self) -> bool:
        return self in (ReadingExit.PERSON_RELEASES, ReadingExit.MAIN_AGENT_HELPS, ReadingExit.EXPIRES)
