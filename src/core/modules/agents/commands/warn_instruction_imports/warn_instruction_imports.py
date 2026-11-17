from dataclasses import dataclass

from engine.command.command import Command
from engine.instruction.instruction_import import InstructionImport


@dataclass(frozen=True)
class WarnInstructionImports(Command[None]):
    """Tells an agent which of the project's CLAUDE.md and AGENTS.md files import a file twice or import each other. The
    faults are found before the command runs, since the walk over the project's folders must never hold the write turn."""

    agent_id: int
    faults: tuple[InstructionImport, ...]
