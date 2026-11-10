from engine.file.file_access import FileAccess
import fcntl
import json
from functools import lru_cache
from engine.file.file_version import FileVersion
import os
from collections.abc import Generator, Sequence
from contextlib import contextmanager
from dataclasses import asdict, replace
from pathlib import Path

from engine.journal.journal_home import JournalHome
from engine.provider.hook_source import HookSource
from engine.provider.managed_hook import ManagedHook
from engine.provider.managed_state import ManagedState
from engine.provider.hook_effect import HookEffect
from engine.errors.refusal import Refusal


class ManagedHooks:
    """The project hooks stored atomically under a shared file lock."""

    def __init__(self, home: JournalHome) -> None:
        self.path = home.managed_hooks_file

    def all(self) -> list[ManagedHook]:
        if not self.path.is_file():
            return []
        with self._locked():
            return self._read()

    def added(self, detected_hooks: Sequence[ManagedHook]) -> list[ManagedHook]:
        with self._locked():
            hooks = {hook.id: hook for hook in self._read()}
            for hook in detected_hooks:
                saved_hook = hooks.get(hook.id)
                if not saved_hook:
                    hooks[hook.id] = replace(hook, state=ManagedState.ENABLED)
                    continue
                sources = {source.path: source for source in saved_hook.all_sources()}
                sources.update({source.path: source for source in hook.all_sources()})
                first = sources.pop(saved_hook.source)
                hooks[hook.id] = replace(hook, state=saved_hook.state, timeout=saved_hook.timeout, source=first.path,
                                        tracked=first.tracked, sources=tuple(sources.values()))
            merged_hooks = list(hooks.values())
            self._write(merged_hooks)
            return merged_hooks

    def changed(self, hook_id: str, state: ManagedState, timeout: int) -> ManagedHook:
        if timeout < 1:
            raise Refusal("a hook timeout must be at least 1 second")
        with self._locked():
            hooks = {hook.id: hook for hook in self._read()}
            if hook_id not in hooks:
                raise Refusal(f"unknown managed hook {hook_id}")
            changed = replace(hooks[hook_id], state=state, timeout=timeout)
            hooks[hook_id] = changed
            self._write(list(hooks.values()))
            return changed

    def drop_stamped(self, stamp: str) -> list[ManagedHook]:
        if not stamp.strip() or not self.path.is_file():
            return []
        with self._locked():
            hooks = self._read()
            removed = [hook for hook in hooks if stamp in hook.command]
            if removed:
                self._write([hook for hook in hooks if stamp not in hook.command])
            return removed

    def removed_commands(self, fragment: str) -> list[ManagedHook]:
        with self._locked():
            hooks = self._read()
            removed = [hook for hook in hooks if fragment in hook.command]
            if removed:
                self._write([hook for hook in hooks if fragment not in hook.command])
            return removed

    def removed_with_source(self) -> list[ManagedHook]:
        with self._locked():
            hooks = self._read()
            self._write([hook for hook in hooks if not hook.source])
            return [hook for hook in hooks if hook.source]

    def emptied(self) -> list[ManagedHook]:
        with self._locked():
            hooks = self._read()
            self._write([])
            return hooks

    @contextmanager
    def _locked(self) -> Generator[None]:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        with FileAccess.shared().writer(self.path.with_suffix(".lock"), "a") as lock:
            fcntl.flock(lock, fcntl.LOCK_EX)
            try:
                yield
            finally:
                fcntl.flock(lock, fcntl.LOCK_UN)

    def _read(self) -> list[ManagedHook]:
        if not self.path.is_file():
            return []
        return list(self.loaded_hooks(FileAccess.shared().version(self.path)))

    @lru_cache(maxsize=128)
    def loaded_hooks(self, version: FileVersion) -> tuple[ManagedHook, ...]:
        stored = json.loads(FileAccess.shared().read(self.path))
        return tuple(replace(ManagedHook(**{key: value for key, value in hook.items() if key != "clash"}), state=ManagedState(hook["state"]),
                             effects=tuple(HookEffect(value) for value in hook.get("clash", [])),
                             sources=tuple(HookSource(**source) for source in hook.get("sources", []))) for hook in stored["hooks"])

    def _write(self, hooks: Sequence[ManagedHook]) -> None:
        with FileAccess.shared().temporary_writer(self.path.parent) as writing:
            try:
                json.dump({"version": 1, "hooks": [{"clash" if key == "effects" else key: value for key, value in asdict(hook).items()} for hook in hooks]}, writing, indent=2)
                writing.write("\n")
                writing.flush()
                os.fsync(writing.fileno())
                FileAccess.shared().replace(writing.name, self.path)
            finally:
                Path(writing.name).unlink(missing_ok=True)
