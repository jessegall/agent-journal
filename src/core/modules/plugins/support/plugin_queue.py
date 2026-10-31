import json
import time
from pathlib import Path

from core.base.type_guards import is_mapping
from core.modules.plugins.support.plugin_answer import PluginAnswer
from core.modules.plugins.support.plugin_queue_read import PluginQueueRead

RESERVED_SUFFIX = ".reserved"
UNREADABLE_SUFFIX = ".bad"
RESERVATION_LIMIT_SECONDS = 60


class PluginQueue:
    """A plugin's queue, the folder queue in its data folder: each file holds one answer for an environment, and
    for one agent when the journal wrote it. A hook reserves a file by renaming it, so no later hook reads it again,
    and it is deleted once the hook has committed; a reserved_file file left a minute, by a hook that never committed, is
    offered again, and a file that is not JSON is set aside."""

    def __init__(self, data_folder: Path) -> None:
        self.folder = data_folder / "queue"

    def reserve(self, environment: str, agent_id: int) -> PluginQueueRead:
        read = PluginQueueRead([], [])
        if not self.folder.is_dir():
            return read
        for expired in [path for path in self.folder.glob(f"*{RESERVED_SUFFIX}") if time.time() - path.stat().st_mtime > RESERVATION_LIMIT_SECONDS]:
            expired.rename(expired.with_suffix(".json"))
        for path in sorted(self.folder.glob("*.json"), key=lambda path: path.stat().st_mtime_ns):
            text = path.read_text()
            try:
                fields: object = json.loads(text or "null")
            except json.JSONDecodeError:
                path.rename(path.with_suffix(UNREADABLE_SUFFIX))
                read.unreadable.append(path.name)
                continue
            if is_mapping(fields) and (("env" in fields and fields["env"] != environment) or ("agent" in fields and fields["agent"] != agent_id)):
                continue
            reserved_file = path.with_suffix(RESERVED_SUFFIX)
            path.rename(reserved_file)
            read.answers.append((reserved_file.name, PluginAnswer.parsed(text)))
        return read

    def remove(self, name: str) -> None:
        (self.folder / name).unlink(missing_ok=True)

    def add(self, environment: str, agent_id: int, text: str, name: str) -> None:
        self.folder.mkdir(parents=True, exist_ok=True)
        draft = self.folder / f"{name}.tmp"
        draft.write_text(json.dumps({"v": 1, "env": environment, "agent": agent_id, "tell": text}))
        draft.rename(self.folder / f"{name}.json")
