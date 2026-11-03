from dataclasses import dataclass


@dataclass
class ShellReadBudget:
    """The bytes a hook may still read and the lines it may still compare."""

    bytes_left: int
    lines_left: int
