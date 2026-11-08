from enum import StrEnum


class UsageLimitMode(StrEnum):
    """A limit is fixed (halt at that percent of the window) or a budget (halt after that many percent more than when it was set)."""

    FIXED = "fixed"
    BUDGET = "budget"
