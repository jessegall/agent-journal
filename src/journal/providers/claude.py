from pathlib import Path

from journal.providers.provider import Provider


class Claude(Provider):
    name = "claude"
    write_tools = frozenset({"Write", "Edit", "MultiEdit", "NotebookEdit"})

    def transcript(self, project: Path, session: str) -> Path: ...

    def resume(self, session: str) -> tuple[str, ...]: ...

    def wire_hooks(self, project: Path, script: Path) -> None: ...
