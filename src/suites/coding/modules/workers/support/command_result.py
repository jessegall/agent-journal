from dataclasses import dataclass


@dataclass(frozen=True)
class CommandResult:
    """How one command ended: done, failed with a known code, or uncertain because it ran out of time and may have
    done part of its work; for the last two, the reason and what to do."""

    state: str
    reason: str = ""
    suggestion: str = ""
