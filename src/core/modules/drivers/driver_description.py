from dataclasses import dataclass


@dataclass(frozen=True)
class DriverDescription:
    """A driver as journal driver show prints it: its suite and role, and the rules that can apply to it, grouped as
    standing rules, overlay rules and its own and added rules."""

    driver: str
    suite: str
    role: str
    standing: str
    overlays: str
    rules: str
