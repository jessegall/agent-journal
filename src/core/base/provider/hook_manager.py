import os
from collections.abc import Mapping, Sequence
from pathlib import Path

from core.base.git.hook_files_git import HookFilesGit
from core.base.provider.managed_hook import ManagedHook
from core.base.provider.managed_hooks import ManagedHooks
from core.base.provider.program_hooks import ProgramHooks
from core.base.provider.provider import Provider
from core.base.type_guards import is_list, is_mapping


class HookManager:
    """Moves project command hooks into the managed store and restores their source files."""

    def __init__(self, root: Path, managed: ManagedHooks) -> None:
        self.root = root
        self.managed = managed

    def import_hooks(self, provider: type[Provider], folder: Path) -> list[ManagedHook]:
        for name in provider.hook_files:
            path = folder / name
            settings = ProgramHooks.read(path)
            kept, commands = ProgramHooks.partitioned(settings.get("hooks"))
            if not commands:
                continue
            self.managed.added(self._detected(provider, folder, name, commands))
            ProgramHooks.store(path, {**settings, "hooks": kept})
        return self.managed.all()

    def unmanaged(self, provider: type[Provider], folder: Path) -> list[ManagedHook]:
        detected_hooks: list[ManagedHook] = []
        for name in provider.hook_files:
            _, commands = ProgramHooks.partitioned(ProgramHooks.read(folder / name).get("hooks"))
            detected_hooks.extend(self._detected(provider, folder, name, commands))
        return detected_hooks

    def restore(self) -> list[ManagedHook]:
        hooks = self.managed.all()
        for hook in hooks:
            path = self.root / hook.source
            settings = ProgramHooks.read(path)
            stored_hooks = settings.get("hooks")
            events = dict(stored_hooks) if is_mapping(stored_hooks) else {}
            blocks = events.get(hook.event)
            events[hook.event] = self._restored_blocks(hook, blocks if is_list(blocks) else [])
            ProgramHooks.store(path, {**settings, "hooks": events})
        self.managed.emptied()
        return hooks

    def _detected(self, provider: type[Provider], folder: Path, name: Path,
                  commands: Sequence[tuple[str, str, Mapping[str, object]]]) -> list[ManagedHook]:
        if not commands:
            return []
        tracked = HookFilesGit(folder).tracks(name)
        source = os.path.relpath(folder / name, self.root)
        return [ManagedHook.found(provider.name, event, matcher, entry, source, tracked) for event, matcher, entry in commands]

    @staticmethod
    def _restored_blocks(hook: ManagedHook, blocks: list[object]) -> list[object]:
        entry = {"type": "command", "command": hook.command, "timeout": hook.timeout, **hook.fields}
        for index, block in enumerate(blocks):
            if not is_mapping(block) or str(block.get("matcher", "")) != hook.matcher or not is_list(entries := block.get("hooks")):
                continue
            return [*blocks[:index], {**block, "hooks": [*entries, entry]}, *blocks[index + 1:]]
        return [*blocks, {"matcher": hook.matcher, "hooks": [entry]}]
