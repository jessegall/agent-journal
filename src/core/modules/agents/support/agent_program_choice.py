from dataclasses import dataclass

from engine.provider.program_model import ProgramModel


@dataclass(frozen=True)
class AgentProgramChoice:
    """A registered program and the models its provider offers."""

    name: str
    title: str
    models: tuple[ProgramModel, ...]
    model_option: str
