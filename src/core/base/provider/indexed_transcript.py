from dataclasses import dataclass, field


@dataclass
class IndexedTranscript:
    """Where each row's line sits in one session file: its byte offset and length, in row order, and how far into
    the file the index has read."""

    lines: list[tuple[int, int]] = field(default_factory=list[tuple[int, int]])
    end_offset: int = 0
