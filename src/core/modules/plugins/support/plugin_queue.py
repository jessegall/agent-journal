import json
from pathlib import Path

from core.base.type_guards import is_mapping


class PluginQueue:
    """A plugin's queue, the folder queue in its data folder: each file holds one line out for an environment,
    read oldest first and deleted once read; a line for another environment stays."""

    def __init__(self, data_folder: Path) -> None:
        self.folder = data_folder / "queue"

    def lines(self, environment: str) -> list[str]:
        if not self.folder.is_dir():
            return []
        lines: list[str] = []
        for path in sorted(self.folder.glob("*.json"), key=lambda path: path.stat().st_mtime_ns):
            fields: object = json.loads(path.read_text() or "null")
            if is_mapping(fields) and "env" in fields and fields["env"] != environment:
                continue
            if is_mapping(fields) and "tell" in fields and fields["tell"]:
                lines.append(str(fields["tell"]))
            path.unlink()
        return lines

    def add(self, environment: str, text: str, name: str) -> None:
        self.folder.mkdir(parents=True, exist_ok=True)
        draft = self.folder / f"{name}.tmp"
        draft.write_text(json.dumps({"v": 1, "env": environment, "tell": text}))
        draft.rename(self.folder / f"{name}.json")
