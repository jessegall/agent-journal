from dataclasses import dataclass


@dataclass(frozen=True)
class TunlerAnswer:
    """What one run of the tunler program answered: whether it succeeded, and its own words."""

    succeeded: bool
    text: str
