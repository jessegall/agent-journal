from dataclasses import dataclass

from engine.enums.model_tier import ModelTier


@dataclass(frozen=True)
class ProgramRequest:
    """The program, model and tier a start line names; each is empty when the line leaves it out."""

    program: str = ""
    program_model: str = ""
    tier: ModelTier | None = None
