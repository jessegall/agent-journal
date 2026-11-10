from dataclasses import dataclass


@dataclass(frozen=True)
class Choice:
    """A choice's value and the label a person reads."""

    key: str
    label: str
