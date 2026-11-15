from enum import StrEnum


class GrantState(StrEnum):
    """Where a grant stands; only a confirmed or approved grant passes a policy."""

    HELD = "held"
    CONFIRMED = "confirmed"
    APPROVED = "approved"
    SPENT = "spent"
    WITHDRAWN = "withdrawn"
    DECLINED = "declined"
