from enum import StrEnum


class CompactionReason(StrEnum):
    """Why a compaction or clear began: the journal asked at a stop over the limit or at the second limit, a
    person asked in the viewer, the program began it by itself, a person typed it in the terminal, or the
    journal ran it for an agent whose program takes no typed line."""

    STOP_LIMIT = "stop_limit"
    HARD_STOP = "hard_stop"
    PERSON = "person"
    AUTO = "auto"
    TERMINAL_PERSON = "terminal_person"
    HEADLESS_PROGRAM = "headless_program"
