from dataclasses import dataclass

from engine.command.command import Command
from core.modules.drivers.models.refusal_skip import RefusalSkip


@dataclass(frozen=True)
class UseRefusalSkip(Command[RefusalSkip]):
    """Marks a waiting skip as spent on the refusal it passed."""

    skip_id: int
