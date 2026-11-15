from enum import StrEnum


class WaitMode(StrEnum):
    """Whether a wait on several subjects ends at the first that ends or when every one has ended."""

    ANY = "any"
    ALL = "all"
