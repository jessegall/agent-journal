from dataclasses import dataclass


@dataclass(frozen=True)
class TypeLimits:
    """The running and retained limits for one agent type."""

    run: int
    kept: int
