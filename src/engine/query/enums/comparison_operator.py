from enum import StrEnum


class ComparisonOperator(StrEnum):
    """The operators a comparison of two expressions may use."""

    EQUAL = "="
    NOT_EQUAL = "!="
    LESS = "<"
    AT_MOST = "<="
    GREATER = ">"
    AT_LEAST = ">="
    IS = "IS"
    IS_NOT = "IS NOT"
    LIKE = "LIKE"
