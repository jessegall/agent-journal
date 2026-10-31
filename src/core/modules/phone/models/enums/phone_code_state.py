from enum import StrEnum


class PhoneCodeState(StrEnum):
    """Whether a pairing code can still pair a phone."""

    OPEN = "open"
    SPENT = "spent"
