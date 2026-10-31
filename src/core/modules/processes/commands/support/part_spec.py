from dataclasses import dataclass


@dataclass(frozen=True)
class PartSpec:
    """One command of a shell line as StartProcess keeps it: its text, its program and whether it pipes into
    the next."""

    text: str
    program: str
    piped: bool = False
