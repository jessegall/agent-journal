from enum import StrEnum


class PhoneState(StrEnum):
    """Whether a phone may still open the viewer."""

    PAIRED = "paired"
    UNPAIRED = "unpaired"
