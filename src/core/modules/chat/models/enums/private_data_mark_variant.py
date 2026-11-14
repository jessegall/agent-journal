from enum import StrEnum


class PrivateDataMarkVariant(StrEnum):
    """What a private data mark says: the scan found something in a file."""

    DETECTED = "found"
