from pathlib import Path

from journal.providers.provider import Provider


class Codex(Provider):
    name = "codex"
    write_tools = frozenset({"apply_patch", "write_file"})
    read_tool = "read_file"

    def transcript(self, project: Path, session: str) -> Path: ...

    def resume(self, session: str) -> tuple[str, ...]: ...

    def wire_hooks(self, project: Path, script: Path) -> None: ...
