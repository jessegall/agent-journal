from dataclasses import dataclass

from core.base.provider.model_tier import ModelTier


@dataclass(frozen=True)
class ProgramModel:
    """A model the program runs, by the name its command line takes, with its tier."""

    name: str
    tier: ModelTier
