from dataclasses import dataclass


@dataclass(frozen=True)
class SetupStep:
    """A step a plugin's install runs in its folder: its name and its shell line."""

    name: str
    line: str
