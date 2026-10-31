import json
from pathlib import Path

from core.base.type_guards import is_mapping
from core.modules.plugins.support.plugin_answer import PluginAnswer


class PluginQueue:
    """A plugin's queue, the folder queue in its data folder: each file holds one answer for an environment, read
    oldest first and deleted once read; an answer for another environment stays."""

    def __init__(self, data_folder: Path) -> None:
        self.folder = data_folder / "queue"

    def answers(self, environment: str) -> list[PluginAnswer]:
        if not self.folder.is_dir():
            return []
        answers: list[PluginAnswer] = []
        for path in sorted(self.folder.glob("*.json"), key=lambda path: path.stat().st_mtime_ns):
            text = path.read_text()
            fields: object = json.loads(text or "null")
            if is_mapping(fields) and "env" in fields and fields["env"] != environment:
                continue
            answers.append(PluginAnswer.parsed(text))
            path.unlink()
        return answers

    def add(self, environment: str, text: str, name: str) -> None:
        self.folder.mkdir(parents=True, exist_ok=True)
        draft = self.folder / f"{name}.tmp"
        draft.write_text(json.dumps({"v": 1, "env": environment, "tell": text}))
        draft.rename(self.folder / f"{name}.json")
