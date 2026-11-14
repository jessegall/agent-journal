from enum import StrEnum


class ReasonCode(StrEnum):
    """Why the engine decided what it did, as a code from a closed set and never text from an output."""

    READER_MISSING = "reader missing"
    FIELDS_MISSING = "fields missing"
    LINES_MISSED = "lines missed"
    OVERSIZED = "too wide"
    SUMMARY_MISSING = "summary missing"
    COUNT_MISSING = "count missing"
    PROGRESS_MISSING = "progress missing"
    READER_FAILED = "reader failed"
    DRAFT_FITS = "draft fits"
    REDIRECTED = "redirected"
    UNKNOWN_COMMAND = "unknown command"
    SILENT_RUN = "silent run"
    REQUEST_WAITING = "request waiting"
    ASKING_FLAG = "asking flag"
    REJECTED = "rejected"
    READ_COMMAND = "read command"
    PLUGIN_RUN = "plugin run"
    SHORT_RUN = "short run"
    UNREADABLE = "unreadable"
    NONE = "none"
