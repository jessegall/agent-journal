from dataclasses import dataclass


@dataclass(frozen=True)
class DumpsSnapshot:
    """The dumps feature's reading: the dump in hand."""

    in_hand: int
