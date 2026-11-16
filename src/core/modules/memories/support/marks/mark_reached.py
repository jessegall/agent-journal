from dataclasses import dataclass


@dataclass(frozen=True)
class MarkReached:
    """A memory mark the agent's context passed: its percent, the tool uses before the agent is blocked, and the
    memories it weighs, heaviest first."""

    percent: int
    tool_uses: int
    memory_ids: tuple[int, ...]
