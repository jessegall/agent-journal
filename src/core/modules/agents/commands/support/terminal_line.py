from dataclasses import dataclass


@dataclass(frozen=True)
class TerminalLine:
    """One line an agent program printed in its terminal, by its number in the launcher's log."""

    number: int
    text: str
