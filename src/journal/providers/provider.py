from pathlib import Path
from typing import ClassVar


class Provider:
    """One agent program, Claude or Codex: the four things the journal has to know about it and nothing else."""

    name: ClassVar[str]
    write_tools: ClassVar[frozenset[str]]
    """The tool names whose call changes a file."""

    def transcript(self, project: Path, session: str) -> Path: ...

    def resume(self, session: str) -> tuple[str, ...]:
        """The arguments that start the program again on the same conversation."""
        ...

    def wire_hooks(self, project: Path, script: Path) -> None:
        """Writes the journal's hook into the program's settings file, idempotently."""
        ...

    def writes(self, tool: str) -> bool:
        return tool in self.write_tools
