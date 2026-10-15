from dataclasses import dataclass


@dataclass(frozen=True)
class Option:
    """One line of a menu: what it says, and the badges after it."""

    label: str
    badges: tuple[str, ...] = ()
