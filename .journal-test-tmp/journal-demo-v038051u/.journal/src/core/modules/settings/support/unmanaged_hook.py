from dataclasses import dataclass


@dataclass(frozen=True)
class UnmanagedHook:
    """A native entry or user-level file the journal leaves unchanged."""

    program: str
    source: str
    event: str | None
    reason: str
