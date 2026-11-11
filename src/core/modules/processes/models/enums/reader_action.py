from enum import StrEnum


class ReaderAction(StrEnum):
    """What the engine asks of the agent about the reader of a command."""

    NOTHING = "nothing"
    SUGGEST = "suggest"
    DRAFT_READY = "draft ready"
    REQUIRE = "require"
    DECLARE_UNREADABLE = "declare unreadable"
