from collections.abc import Sequence
from dataclasses import dataclass


@dataclass(frozen=True)
class WindowEntry:
    """A registered window: its name, the module that declares it, the read lines and commands it may run, and
    whether the journal ships its module."""

    name: str
    module: str
    reads: Sequence[str]
    runs: Sequence[str]
    shipped: bool
