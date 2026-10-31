from dataclasses import dataclass


@dataclass(frozen=True)
class OutputLines:
    """The lines a read of outputs prints."""

    lines: tuple[str, ...]
