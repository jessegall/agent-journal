import json
import re
import time
from collections.abc import Collection
from pathlib import Path

from core.base.type_guards import is_mapping
from core.modules.plugins.support.plugin_answer import PluginAnswer
from core.modules.plugins.support.plugin_card_answer import PluginCardAnswer
from core.modules.plugins.support.plugin_queue_read import PluginQueueRead

RESERVED_SUFFIX = ".reserved"
UNREADABLE_SUFFIX = ".bad"
RESERVATION_LIMIT_SECONDS = 60
FIRING_UNSAFE = r"[^A-Za-z0-9-]"
CLAIMED_SUFFIX = ".claimed"
CARD_FIELDS = frozenset(["cards", "judged_ms", "read_ms", "judged_total_ms"])
ENVELOPE_FIELDS = frozenset(["v", "env", "agent"])


class PluginQueue:
    """A plugin's queue folder: a hook renames a file to reserve it and deletes it once committed."""

    def __init__(self, data_folder: Path) -> None:
        self.folder = data_folder / "queue"

    def reserved_names(self) -> list[str]:
        return [path.name for path in self.folder.glob(f"*{RESERVED_SUFFIX}")] if self.folder.is_dir() else []

    def reserve(self, environment: str, agent_id: int, firing: str, committed_names: Collection[str]) -> PluginQueueRead:
        read = PluginQueueRead([], [])
        if not self.folder.is_dir():
            return read
        for expired in [path for path in self.folder.glob(f"*{RESERVED_SUFFIX}")
                        if path.name not in committed_names and time.time() - path.stat().st_mtime > RESERVATION_LIMIT_SECONDS]:
            expired.rename(self.folder / expired.name.rsplit(".", 2)[0])
        for path in self.queued_paths():
            try:
                text = path.read_text()
            except FileNotFoundError:
                continue
            try:
                fields: object = json.loads(text or "null")
            except json.JSONDecodeError:
                path.rename(path.with_suffix(UNREADABLE_SUFFIX))
                read.unreadable.append(path.name)
                continue
            if is_mapping(fields) and (("env" in fields and fields["env"] != environment) or ("agent" in fields and fields["agent"] != agent_id)):
                continue
            reserved_file = self.folder / f"{path.name}.{re.sub(FIRING_UNSAFE, '-', firing)}{RESERVED_SUFFIX}"
            try:
                path.rename(reserved_file)
            except FileNotFoundError:
                continue
            read.answers.append((reserved_file.name, PluginAnswer.parsed(text)))
        return read

    def claim_cards(self) -> list[PluginCardAnswer]:
        return [answer for path in self.queued_paths() for answer in self.card_answer(path)]

    def queued_paths(self) -> list[Path]:
        stamped = [(self.modified_ns(path), path) for path in self.folder.glob("*.json")] if self.folder.is_dir() else []
        return [path for modified_ns, path in sorted(stamped) if modified_ns >= 0]

    @staticmethod
    def modified_ns(path: Path) -> int:
        try:
            return path.stat().st_mtime_ns
        except FileNotFoundError:
            return -1

    def card_answer(self, path: Path) -> list[PluginCardAnswer]:
        claimed_file = path.with_suffix(CLAIMED_SUFFIX)
        try:
            path.rename(claimed_file)
        except FileNotFoundError:
            return []
        text = claimed_file.read_text()
        try:
            fields: object = json.loads(text or "null")
        except json.JSONDecodeError:
            claimed_file.rename(path)
            return []
        if not is_mapping(fields) or not all(key in fields for key in ("agent", "cards")):
            claimed_file.rename(path)
            return []
        line_fields = {key: value for key, value in fields.items() if key not in CARD_FIELDS}
        if set(line_fields) <= ENVELOPE_FIELDS:
            claimed_file.unlink()
        else:
            claimed_file.write_text(json.dumps(line_fields))
            claimed_file.rename(path)
        return [PluginCardAnswer(int(str(fields["agent"])), json.dumps({key: value for key, value in fields.items() if key in CARD_FIELDS}))]

    def remove(self, name: str) -> None:
        (self.folder / name).unlink(missing_ok=True)

    def add(self, environment: str, agent_id: int, text: str, name: str) -> None:
        self.folder.mkdir(parents=True, exist_ok=True)
        draft = self.folder / f"{name}.tmp"
        draft.write_text(json.dumps({"v": 1, "env": environment, "agent": agent_id, "tell": text}))
        draft.rename(self.folder / f"{name}.json")
