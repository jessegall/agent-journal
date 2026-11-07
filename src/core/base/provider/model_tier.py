from enum import StrEnum

from core.base.refusal import Refusal


class ModelTier(StrEnum):
    """How capable a program's model is, so a driver asks for a tier rather than a model's name."""

    FAST = "fast"
    GENERAL = "general"
    STRONGEST = "strongest"
    RARE = "rare"

    @classmethod
    def automatic(cls, value: str) -> "ModelTier":
        tier = cls(value)
        if tier is cls.RARE:
            raise Refusal("the rare tier needs a named model", "name the model with --model <model>")
        return tier
