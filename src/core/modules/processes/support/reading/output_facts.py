import re
from dataclasses import dataclass

from engine.enums.command_category import CommandCategory
from core.modules.processes.models.enums.unreadable_reason import UnreadableReason
from core.modules.processes.support.reader_judge import ReaderJudge

SAMPLE_BYTES = 64 * 1024
BINARY_SHARE_LIMIT = 0.10
UNBROKEN_LINE_BYTES = 8 * 1024
CARRIAGE_RETURN_LIMIT = 0.5
PROMPT_TAIL = re.compile(rb"[:?>] ?$")
PROMPT_TAIL_BYTES = 200


@dataclass(frozen=True)
class OutputFacts:
    """What one part of a run printed, measured once for judging: its size, its lines, how much of its first
    64 KB is text, whether it ends on a prompt, and whether the run was rejected, crashed at its start or was
    cut short. The thresholds come from report 1325; an unbroken line counts only after the last newline."""

    byte_count: int
    line_count: int
    longest_line: int
    trailing_line_bytes: int
    carriage_return_share: float
    binary_share: float
    has_null_byte: bool
    ends_on_prompt: bool
    watched_and_ended: bool
    was_rejected: bool
    start_crashed: bool
    was_cut_short: bool

    @classmethod
    def measured(cls, sample: bytes, byte_count: int, exit_code: int | None, category: CommandCategory) -> "OutputFacts":
        sample = sample[:SAMPLE_BYTES]
        text = sample.decode("utf-8", errors="replace")
        size = len(sample) or 1
        valid_bytes = len(sample.decode("utf-8", errors="ignore").encode("utf-8"))
        return cls(byte_count=byte_count, line_count=sample.count(b"\n"), longest_line=max(len(line) for line in sample.split(b"\n")),
                   trailing_line_bytes=len(sample) - sample.rfind(b"\n") - 1, carriage_return_share=sample.count(b"\r") / size,
                   binary_share=(len(sample) - valid_bytes) / size, has_null_byte=b"\0" in sample,
                   ends_on_prompt=bool(sample) and not sample.endswith(b"\n") and bool(PROMPT_TAIL.search(sample[-PROMPT_TAIL_BYTES:])),
                   watched_and_ended=category.is_watched and exit_code is not None, was_rejected=ReaderJudge.is_rejected(exit_code, text),
                   start_crashed=ReaderJudge.is_crashed_start(category, text), was_cut_short=ReaderJudge.is_killed(exit_code, text))

    @property
    def unreadable_reason(self) -> UnreadableReason | None:
        if self.byte_count == 0:
            return UnreadableReason.EMPTY if self.watched_and_ended else None
        if self.has_null_byte or self.binary_share > BINARY_SHARE_LIMIT:
            return UnreadableReason.BINARY
        if self.trailing_line_bytes > UNBROKEN_LINE_BYTES or self.carriage_return_share > CARRIAGE_RETURN_LIMIT:
            return UnreadableReason.SINGLE_LINE
        if self.ends_on_prompt:
            return UnreadableReason.INTERACTIVE
        return None
