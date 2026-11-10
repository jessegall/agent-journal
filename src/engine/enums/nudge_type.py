from enum import StrEnum


class NudgeType(StrEnum):
    """What a line does to the agent: info explains a thing and may be long, steering asks it to act or to
    change course in a short line, a refusal holds what it tried, and a safety refusal holds it with no skip."""

    NOTICE = "info"
    STEERING = "steering"
    REFUSAL = "refusal"
    SAFETY_REFUSAL = "safety_refusal"
