from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class WarnInstructionImports(Command[None]):
    """Tells an agent which of the project's CLAUDE.md and AGENTS.md files import a file twice or import each other."""

    agent_id: int
