from dataclasses import dataclass


@dataclass(frozen=True)
class TextField:
    """A button field for words a person types."""

    name: str
    label: str
