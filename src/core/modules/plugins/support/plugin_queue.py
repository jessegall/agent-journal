from core.base.file_access import FileAccess
import json
import fcntl
import os
import re
from collections.abc import Collection, Generator
from contextlib import ExitStack, contextmanager
from pathlib import Path
from typing import IO

from engine.time.clock import Clock
from engine.types.type_guards import is_mapping
from core.modules.plugins.support.plugin_answer import PluginAnswer
from core.modules.plugins.support.plugin_card_answer import PluginCardAnswer
from core.modules.plugins.support.plugin_card_claim import PluginCardClaim
from core.modules.plugins.support.plugin_queue_read import PluginQueueRead

RESERVED_SUFFIX = ".reserved"
UNREADABLE_SUFFIX = ".bad"
RESERVATION_LIMIT_SECONDS = 60
FIRING_UNSAFE = r"[^A-Za-z0-9-]"
CLAIMED_SUFFIX = ".claimed"
CARD_FIELDS = frozenset(["cards", "judged_ms", "read_ms", "judged_total_ms"])
ENVELOPE_FIELDS = frozenset(["v", "env", "agent"])


class PluginQueue:
    """A plugin's queued answers, locked while a hook reserves one or a tick saves its cards."""

    def __init__(self, data_folder: Path) -> None:
        self.folder = data_folder / "queue"

    def reserved_names(self) -> list[str]:
        return [path.name for path in self.folder.glob(f"*{RESERVED_SUFFIX}")] if self.folder.is_dir() else []

    def reserve(self, environment: str, agent_id: int, firing: str, committed_names: Collection[str], clock: Clock) -> PluginQueueRead:
        read = PluginQueueRead([], [])
        if not self.folder.is_dir():
            return read
        self.restore_reservations(committed_names, clock)
        for path in self.queued_paths():
            try:
                self.reserve_file(path, environment, agent_id, firing, read)
            except FileNotFoundError:
                continue
        return read

    def reserve_file(self, path: Path, environment: str, agent_id: int, firing: str, read: PluginQueueRead) -> None:
        with self.lock_file(path) as source:
            if source is None:
                return
            text = FileAccess.shared().read(path)
            try:
                fields: object = json.loads(text or "null")
            except json.JSONDecodeError:
                path.rename(path.with_suffix(UNREADABLE_SUFFIX))
                read.unreadable.append(path.name)
                return
            if is_mapping(fields) and (("env" in fields and fields["env"] != environment) or ("agent" in fields and fields["agent"] != agent_id)):
                return
            reserved_file = self.folder / f"{path.name}.{re.sub(FIRING_UNSAFE, '-', firing)}{RESERVED_SUFFIX}"
            try:
                path.rename(reserved_file)
            except FileNotFoundError:
                return
            read.answers.append((reserved_file.name, PluginAnswer.parsed(text)))

    def restore_reservations(self, committed_names: Collection[str], clock: Clock) -> None:
        for path in self.folder.glob(f"*{RESERVED_SUFFIX}"):
            with self.lock_file(path) as source:
                if source is None or path.name in committed_names:
                    continue
                if clock.epoch_seconds() - os.fstat(source.fileno()).st_mtime <= RESERVATION_LIMIT_SECONDS:
                    continue
                try:
                    path.rename(self.folder / path.name.rsplit(".", 2)[0])
                except FileNotFoundError:
                    continue

    def claim_cards(self) -> Generator[PluginCardClaim]:
        for path in self.queued_paths():
            with self.lock_file(path) as source:
                if source is None:
                    continue
                claim = self.card_answer(path, FileAccess.shared().read(path))
                if claim is None:
                    continue
                try:
                    yield claim
                finally:
                    self.restore_claim(claim.path)

    def queued_paths(self) -> list[Path]:
        if not self.folder.is_dir():
            return []
        self.restore_claims()
        modified: dict[Path, int] = {}
        for path in self.folder.glob("*.json"):
            try:
                modified[path] = path.stat().st_mtime_ns
            except FileNotFoundError:
                continue
        return sorted(modified, key=modified.__getitem__)

    def card_answer(self, path: Path, text: str) -> PluginCardClaim | None:
        try:
            fields: object = json.loads(text or "null")
        except json.JSONDecodeError:
            path.rename(path.with_suffix(UNREADABLE_SUFFIX))
            return None
        if not is_mapping(fields) or not all(key in fields for key in ("agent", "cards")):
            return None
        if not PluginAnswer.parsed(text).cards:
            return None
        try:
            agent_id = int(str(fields["agent"]))
        except ValueError:
            path.rename(path.with_suffix(UNREADABLE_SUFFIX))
            return None
        line_fields = {key: value for key, value in fields.items() if key not in CARD_FIELDS}
        remaining = None if set(line_fields) <= ENVELOPE_FIELDS else json.dumps(line_fields)
        answer = PluginCardAnswer(agent_id, json.dumps({key: value for key, value in fields.items() if key in CARD_FIELDS}))
        claimed_file = path.with_suffix(CLAIMED_SUFFIX)
        try:
            path.rename(claimed_file)
        except FileNotFoundError:
            return None
        return PluginCardClaim(claimed_file, answer, remaining)

    def restore_claims(self) -> None:
        for path in self.folder.glob(f"*{CLAIMED_SUFFIX}"):
            with self.lock_file(path) as source:
                if source is None:
                    continue
                self.restore_claim(path)

    def restore_claim(self, path: Path) -> None:
        original = path.with_suffix(".json")
        if original.exists():
            return
        try:
            path.rename(original)
        except FileNotFoundError:
            return

    @contextmanager
    def lock_file(self, path: Path) -> Generator[IO[str] | None]:
        stack = ExitStack()
        try:
            source = stack.enter_context(FileAccess.shared().writer(path, "r+"))
        except FileNotFoundError:
            yield None
            return
        with stack:
            try:
                fcntl.flock(source, fcntl.LOCK_EX | fcntl.LOCK_NB)
            except BlockingIOError:
                yield None
                return
            yield source

    def remove(self, name: str) -> None:
        (self.folder / name).unlink(missing_ok=True)

    def add(self, environment: str, agent_id: int, text: str, name: str) -> None:
        self.folder.mkdir(parents=True, exist_ok=True)
        draft = self.folder / f"{name}.tmp"
        FileAccess.shared().write(draft, json.dumps({"v": 1, "env": environment, "agent": agent_id, "tell": text}))
        draft.rename(self.folder / f"{name}.json")
