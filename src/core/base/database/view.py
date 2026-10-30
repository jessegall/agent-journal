from dataclasses import dataclass


@dataclass(frozen=True)
class View:
    """A view a module declares: its name and the SELECT it shows, made again at every sync."""

    name: str
    select: str
