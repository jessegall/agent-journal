from collections.abc import Sequence as Steps
from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.sequences.models.sequence import Sequence


@dataclass(frozen=True)
class MakeSequence(Command[Sequence]):
    """Writes a sequence with its title and its steps in order."""

    lock = False

    title: str
    steps: Steps[str]
    triggers: str = "[]"
    step_guards: str = "[]"
