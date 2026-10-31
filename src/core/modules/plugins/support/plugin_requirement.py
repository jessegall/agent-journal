from dataclasses import dataclass


@dataclass(frozen=True)
class PluginRequirement:
    """A program a plugin needs: its name, the shell line that finds it, and how to get it when it is missing."""

    name: str
    check: str
    hint: str
