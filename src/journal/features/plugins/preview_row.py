from dataclasses import dataclass


@dataclass(frozen=True)
class PreviewRow:
    """One thing a plugin runs, hears, holds, needs or brings, as its preview lists it: a kind, a label and the command or names."""

    kind: str
    label: str
    command: str = ""
