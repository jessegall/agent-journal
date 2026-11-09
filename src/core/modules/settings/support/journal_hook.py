from dataclasses import dataclass


@dataclass(frozen=True)
class JournalHook:
    """The journal's own entry for one event in a program's hook file."""

    program: str
    event: str
    source: str
    timeout: int
