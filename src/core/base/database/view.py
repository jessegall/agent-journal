from dataclasses import dataclass


@dataclass(frozen=True)
class View:
    """A database view a module defines: its name and its SELECT."""

    name: str
    select: str
