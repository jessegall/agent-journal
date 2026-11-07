from typing import Protocol

from core.base.model_tier import ModelTier


class WorkerProgramRequest(Protocol):
    """The program, model and tier requested at dispatch."""

    program: str
    program_model: str
    tier: ModelTier | None
