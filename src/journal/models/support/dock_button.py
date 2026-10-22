from dataclasses import dataclass


@dataclass(frozen=True)
class DockButton:
    """One button on a row's dock card: its label and the act it posts; open opens the row and close takes the card down."""

    label: str
    act: str
