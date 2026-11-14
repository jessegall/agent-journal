from dataclasses import dataclass


@dataclass(frozen=True)
class WorkPreset:
    """One preset of the workflow controls: its name, a line about it, and the value it gives each control."""

    key: str
    name: str
    line: str
    values: tuple[tuple[str, bool], ...]
