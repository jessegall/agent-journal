from dataclasses import dataclass


@dataclass(frozen=True)
class VoiceLine:
    """One voice of the list: its name, what it would say in answer to a finished fix, and whether it is the
    one selected."""

    name: str
    sample: str
    selected: bool
