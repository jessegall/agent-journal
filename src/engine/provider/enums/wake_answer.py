from enum import StrEnum


class WakeAnswer(StrEnum):
    """How an agent program is woken by its wake hook: on exit code 2, showing the hook's stderr (Claude Code), or by
    a Stop answer that blocks with a reason the program takes as its next prompt (Codex)."""

    EXIT_WITH_STDERR = "exit_with_stderr"
    BLOCK_WITH_REASON = "block_with_reason"
