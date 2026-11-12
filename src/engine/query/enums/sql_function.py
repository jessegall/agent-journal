from enum import StrEnum


class SqlFunction(StrEnum):
    """The SQL functions an expression may call."""

    COALESCE = "coalesce"
    NULLIF = "nullif"
    MAX = "max"
    MIN = "min"
    SUM = "sum"
    COUNT = "count"
    AVG = "avg"
    ROUND = "round"
    SUBSTR = "substr"
    INSTR = "instr"
    JSON_EXTRACT = "json_extract"
    JSON_ARRAY_LENGTH = "json_array_length"
    JSON_OBJECT = "json_object"
    JSON_GROUP_ARRAY = "json_group_array"
    JSON_QUOTE = "json_quote"
    GROUP_CONCAT = "group_concat"
