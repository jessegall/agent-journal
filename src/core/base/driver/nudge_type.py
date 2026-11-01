from enum import StrEnum


class NudgeType(StrEnum):
    """What a line does to the agent: an instruction asks it to act, a remark asks for nothing now, a refusal
    holds what it tried."""

    INSTRUCTION = "instruction"
    REMARK = "remark"
    REFUSAL = "refusal"
