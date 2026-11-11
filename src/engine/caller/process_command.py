from dataclasses import dataclass


@dataclass(frozen=True)
class ProcessCommand:
    """One process of the machine's process table with the parts of its command line."""

    pid: int
    parent_pid: int
    command_parts: tuple[str, ...]
