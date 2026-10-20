from dataclasses import dataclass


@dataclass(frozen=True)
class ShellStanding:
    """The shell feature's reading: the agent's commands running in the background."""

    background: tuple[int, ...]
