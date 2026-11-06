from dataclasses import dataclass


@dataclass(frozen=True)
class ReaderAdvance:
    """What the reader made of the bytes that arrived since it last looked: its new lines, how far it has
    read, and the summary and progress it found; a script reader's lines replace what the file held."""

    lines: list[str]
    read_offset: int
    read_lines: int
    received_offset: int
    summary: str
    progress: int
    replaces: bool = False
    steps_passed: int = 0
    steps_failed: int = 0
    test_count: int = 0
    progress_count_read: bool = False
