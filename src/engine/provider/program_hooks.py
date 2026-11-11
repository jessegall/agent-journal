import json
from collections.abc import Mapping, Sequence
from dataclasses import dataclass, field
from pathlib import Path

from engine.json.json_settings import JsonSettings
from engine.provider.hook_partition import HookPartition
from engine.provider.hook_block_partition import HookBlockPartition
from engine.provider.managed_hook import ManagedHook
from engine.provider.provider import Provider
from engine.types.type_guards import is_list, is_mapping

JOURNAL_MARKS = ("journal-hook", "hooks/hook.sh")
# Longer than the hook program's wait for a restarting server and its last ask, so the program never kills that wait.
HOOK_TIMEOUT_SECONDS = 90
TIMEOUT_PADDING_SECONDS = 5
JOURNAL_WAIT_CEILING_SECONDS = HOOK_TIMEOUT_SECONDS - TIMEOUT_PADDING_SECONDS


@dataclass(frozen=True)
class ProgramHooks:
    """One agent program's hook settings file: the journal's hooks in it are replaced by one per event the
    program sends, each running the hook program with the program's name and the project root, beside the
    settings its provider adds; the rest stays as it was."""

    program: str
    path: Path
    events: Sequence[str]
    timeout_seconds: int
    entry_fields: Mapping[str, object] = field(default_factory=lambda: {})
    provider: type[Provider] | None = None
    event_fields: Mapping[str, Mapping[str, object]] = field(default_factory=lambda: {})

    @classmethod
    def hooks(cls, provider: type[Provider], folder: Path) -> "ProgramHooks":
        return cls.journal(provider, folder / provider.hook_file.path)

    @classmethod
    def journal(cls, provider: type[Provider], path: Path) -> "ProgramHooks":
        return cls(provider.name, path, list(provider.hook_events), HOOK_TIMEOUT_SECONDS, provider.hook_file.entry_values, provider,
                   event_fields=provider.hook_file.event_values)

    def journal_blocks(self, runner: str, root: Path, managed: Sequence[ManagedHook] = ()) -> dict[str, list[object]]:
        return {event: [{"matcher": "", "hooks": [{"type": "command", "command": f'{runner} {self.program} "{root}"', "timeout": self.entry_timeout(event, managed),
                                                   **self.entry_fields, **self.event_fields.get(event, {})}]}] for event in self.events}

    def write(self, runner: str, root: Path, managed: Sequence[ManagedHook] = ()) -> None:
        settings = self.settings()
        hooks = self.partitioned(settings.get("hooks")).native
        for event, blocks in self.journal_blocks(runner, root, managed).items():
            hooks.setdefault(event, []).extend(blocks)
        provider_settings: Mapping[str, object] = self.provider.hook_settings(runner, root) if self.provider else {}
        self.store(self.path, {**settings, **provider_settings, "hooks": {event: blocks for event, blocks in hooks.items() if blocks}})
        if self.provider is not None:
            self.provider.record_hook_write(self.path, hooks)

    def entry_timeout(self, event: str, managed: Sequence[ManagedHook]) -> int:
        longest = max((hook.timeout for hook in managed if hook.program == self.program and hook.event == event), default=0)
        if not longest:
            return self.timeout_seconds
        return max(self.timeout_seconds, longest + JOURNAL_WAIT_CEILING_SECONDS + TIMEOUT_PADDING_SECONDS)

    def is_complete(self) -> bool:
        stored_hooks = self.settings().get("hooks")
        return is_mapping(stored_hooks) and all(is_list(blocks := stored_hooks.get(event)) and any(self.is_journals(block) for block in blocks)
                                                for event in self.events)

    def names_root(self, root: Path) -> bool:
        stored_hooks = self.settings().get("hooks")
        hooks: Mapping[object, object] = stored_hooks if is_mapping(stored_hooks) else {}
        stored_events = (hooks.get(event) for event in self.events)
        blocks = [block for stored in stored_events if is_list(stored) for block in stored if self.is_journals(block)]
        return all(f'"{root}"' in json.dumps(block).replace('\\"', '"') for block in blocks)

    def settings(self) -> dict[str, object]:
        return self.read(self.path)

    @property
    def uses_shell_runner(self) -> bool:
        return JOURNAL_MARKS[1] in json.dumps(self.settings().get("hooks"))

    @staticmethod
    def read(path: Path) -> dict[str, object]:
        return JsonSettings.read(path)

    @staticmethod
    def store(path: Path, settings: Mapping[str, object]) -> None:
        JsonSettings.write(path, settings)

    @staticmethod
    def partitioned(stored_hooks: object) -> HookPartition:
        kept: dict[str, list[object]] = {}
        native: dict[str, list[object]] = {}
        journal: dict[str, list[object]] = {}
        commands: list[tuple[str, str, Mapping[str, object]]] = []
        if not is_mapping(stored_hooks):
            return HookPartition(kept, native, journal, commands)
        events = {str(event): blocks for event, blocks in stored_hooks.items()}
        for event, blocks in events.items():
            if not is_list(blocks):
                continue
            for block in blocks:
                parts = ProgramHooks._partitioned_block(event, block)
                ProgramHooks._append_blocks(kept, event, parts.kept)
                ProgramHooks._append_blocks(native, event, parts.native)
                ProgramHooks._append_blocks(journal, event, parts.journal)
                commands.extend(parts.commands)
        return HookPartition(kept, native, journal, commands)

    @staticmethod
    def _partitioned_block(event: str, block: object) -> HookBlockPartition:
        if not is_mapping(block) or not is_list(entries := block.get("hooks")):
            return HookBlockPartition([block], [block], [], [])
        journal = [entry for entry in entries if ProgramHooks.is_journals(entry)]
        native = [entry for entry in entries if not ProgramHooks.is_journals(entry)]
        commands = [{str(key): value for key, value in entry.items()} for entry in native if is_mapping(entry) and entry.get("type") == "command"]
        kept = [entry for entry in entries if entry not in commands]
        return HookBlockPartition(
            [{**block, "hooks": kept}] if kept else [],
            [{**block, "hooks": native}] if native else [],
            [{**block, "hooks": journal}] if journal else [],
            [(event, str(block.get("matcher", "")), entry) for entry in commands],
        )

    @staticmethod
    def _append_blocks(target: dict[str, list[object]], event: str, blocks: Sequence[object]) -> None:
        if not blocks:
            return
        target.setdefault(event, []).extend(blocks)

    @staticmethod
    def is_journals(block: object) -> bool:
        return any(mark in json.dumps(block) for mark in JOURNAL_MARKS)
