from typing import Protocol

from engine.enums.model_tier import ModelTier


class WorkerProgramRequest(Protocol):
    """The program, model and tier requested at dispatch."""

    @property
    def program(self) -> str: ...

    @property
    def program_model(self) -> str: ...

    @property
    def tier(self) -> ModelTier | None: ...
