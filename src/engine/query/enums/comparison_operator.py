from enum import StrEnum


class ComparisonOperator(StrEnum):
    """The operators a comparison of two expressions may use."""

    EQUAL = "="
    UNEQUAL = "!="
    LESS = "<"
    MAXIMUM = "<="
    GREATER = ">"
    MINIMUM = ">="
    IS = "IS"
    DISTINCT = "IS NOT"
    LIKE = "LIKE"
