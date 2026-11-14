from dataclasses import dataclass


@dataclass(frozen=True)
class PluginCommandRun:
    """What journal plugin run gives back: the number of its output, its exit code and what it printed."""

    process_id: int
    exit_code: int
    output: str
