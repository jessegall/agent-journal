from enum import StrEnum


class GrantType(StrEnum):
    """The exceptions a policy may be passed by, each spent once."""

    REFUSAL_SKIP = "refusal-skip"
    GUARD_SKIP = "guard-skip"
    ALIAS_SKIP = "alias-skip"
    PERMISSION = "permission"
