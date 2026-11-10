from dataclasses import dataclass

from engine.command.command import Command
from core.modules.drivers.models.refusal_skip import RefusalSkip


@dataclass(frozen=True)
class AnswerRefusalSkip(Command[RefusalSkip]):
    """The agent's final answer to its held skip: confirmed, with what it tried instead, or withdrawn."""

    skip_id: int
    is_confirmed: bool
    tried: str = ""
