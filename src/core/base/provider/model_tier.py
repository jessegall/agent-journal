from enum import StrEnum


class ModelTier(StrEnum):
    """How capable a program's model is, so a driver asks for a tier rather than a model's name."""

    FAST = "fast"
    GENERAL = "general"
    STRONGEST = "strongest"
