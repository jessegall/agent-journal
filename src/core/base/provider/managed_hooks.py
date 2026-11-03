import fcntl
import json
import os
import tempfile
from collections.abc import Generator, Sequence
from contextlib import contextmanager
from dataclasses import asdict, replace
from pathlib import Path

from core.base.journal_home import JournalHome
from core.base.provider.managed_hook import ManagedHook
from core.base.provider.managed_state import ManagedState


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
                hooks[hook.id] = replace(hook, state=saved_hook.state, timeout=saved_hook.timeout, source=saved_hook.source,
                                        tracked=hook.tracked if hook.source == saved_hook.source else saved_hook.tracked)
            merged_hooks = list(hooks.values())
            self._write(merged_hooks)
            return merged_hooks

    def changed(self, hook_id: str, state: ManagedState, timeout: int) -> ManagedHook:
        with self._locked():
            hooks = {hook.id: hook for hook in self._read()}
            changed = replace(hooks[hook_id], state=state, timeout=timeout)
            hooks[hook_id] = changed
            self._write(list(hooks.values()))
            return changed

    def emptied(self) -> list[ManagedHook]:
        with self._locked():
            hooks = self._read()
            self._write([])
            return hooks

    @contextmanager
    def _locked(self) -> Generator[None]:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        with self.path.with_suffix(".lock").open("a") as lock:
            fcntl.flock(lock, fcntl.LOCK_EX)
            try:
                yield
            finally:
                fcntl.flock(lock, fcntl.LOCK_UN)

    def _read(self) -> list[ManagedHook]:
        if not self.path.is_file():
            return []
        stored = json.loads(self.path.read_text())
        return [ManagedHook(**{**hook, "state": ManagedState(hook["state"])}) for hook in stored["hooks"]]

    def _write(self, hooks: Sequence[ManagedHook]) -> None:
        with tempfile.NamedTemporaryFile(mode="w", dir=self.path.parent, delete=False) as writing:
            try:
                json.dump({"version": 1, "hooks": [asdict(hook) for hook in hooks]}, writing, indent=2)
                writing.write("\n")
                writing.flush()
                os.fsync(writing.fileno())
                os.replace(writing.name, self.path)
            finally:
                Path(writing.name).unlink(missing_ok=True)
