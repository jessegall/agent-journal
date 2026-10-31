from enum import StrEnum


class RefusalStyle(StrEnum):
    """How the Go hook program prints a refusal for one event; an event with none gets exit code 2 and the reason on
    stderr."""

    DENY = "deny"
    BLOCK = "block"
