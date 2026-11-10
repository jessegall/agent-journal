from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class RemoveInstructionImport(Command[str]):
    """Removes a doubled or crossing import line from one of the project's CLAUDE.md or AGENTS.md files."""

    file: str
    imported: str
