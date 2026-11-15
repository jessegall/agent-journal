from enum import StrEnum


class AnswerEncoding(StrEnum):
    """How a program's answer encodes a refusal."""

    JSON_DECISION = "json-decision"
    STDERR_EXIT_TWO = "stderr-exit-two"
    BLOCK = "block"
