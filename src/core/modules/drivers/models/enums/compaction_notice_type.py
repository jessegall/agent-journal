from enum import StrEnum


class CompactionNoticeType(StrEnum):
    """What a person is told about a compaction that went wrong: its line never started, no context size was
    read after it ended, it left the context at the limit or over it, or it failed."""

    UNSTARTED = "unstarted"
    UNMEASURED = "unmeasured"
    UNREDUCED = "unreduced"
    FAILED = "failed"

    @property
    def text(self) -> str:
        return NOTICE_TEXTS[self]


NOTICE_TEXTS = {
    CompactionNoticeType.UNSTARTED: "the line that compacts its context was typed and never started; choose Compact on the agent to try again",
    CompactionNoticeType.UNMEASURED: "no context size was reported after its compaction ended, so its context size is unknown",
    CompactionNoticeType.UNREDUCED: "its compaction left the context at the limit or over it; it is compacted again only after the context has grown",
    CompactionNoticeType.FAILED: "its compaction failed",
}
