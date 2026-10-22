from dataclasses import dataclass


@dataclass(frozen=True)
class Option:
    """One line of a menu: what it says, the badges after it, and whether it stands apart from the lines above it with a blank line between."""

    label: str
    badges: tuple[str, ...] = ()
    separate: bool = False
