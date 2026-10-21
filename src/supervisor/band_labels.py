from dataclasses import dataclass


@dataclass(frozen=True)
class BandLabels:
    """The band's words: one on the left, one in the middle, one on the right."""

    start_label: str
    middle_label: str
    end_label: str
