import json
from collections.abc import Mapping, Sequence
from dataclasses import dataclass, field
from pathlib import Path

from core.base.provider.managed_hook import ManagedHook
from core.base.provider.provider import Provider
from core.base.type_guards import is_list, is_mapping

JOURNAL_MARKS = ("journal-hook", "hooks/hook.sh")
# Longer than the hook program's wait for a restarting server and its last ask, so the program never kills that wait.
HOOK_TIMEOUT_SECONDS = 90
JOURNAL_WAIT_CEILING_SECONDS = 25
TIMEOUT_PADDING_SECONDS = 5


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

    @classmethod
    def hooks(cls, provider: type[Provider], folder: Path) -> "ProgramHooks":
        return cls(provider.name, folder / provider.hook_file.path, list(provider.hook_events), HOOK_TIMEOUT_SECONDS, provider.hook_file.entry_values, provider)

    def write(self, runner: str, root: Path, managed: Sequence[ManagedHook] = ()) -> None:
        settings = self.settings()
        hooks = self.without_journals(settings.get("hooks"))
        for event in self.events:
            hooks.setdefault(event, []).append({"matcher": "", "hooks": [{"type": "command", "command": f'{runner} {self.program} "{root}"', "timeout": self.entry_timeout(event, managed),
                                                                     **self.entry_fields}]})
        self.store(self.path, {**settings, **(self.provider.hook_settings(runner, root) if self.provider else {}), "hooks": {event: blocks for event, blocks in hooks.items() if blocks}})

    def entry_timeout(self, event: str, managed: Sequence[ManagedHook]) -> int:
        longest = max((hook.timeout for hook in managed if hook.program == self.program and hook.event == event), default=0)
        return max(self.timeout_seconds, longest + JOURNAL_WAIT_CEILING_SECONDS + TIMEOUT_PADDING_SECONDS)

    def is_complete(self) -> bool:
        stored_hooks = self.settings().get("hooks")
        return is_mapping(stored_hooks) and all(is_list(blocks := stored_hooks.get(event)) and any(self.is_journals(block) for block in blocks)
                                                for event in self.events)

    def settings(self) -> dict[object, object]:
        return self.read(self.path)

    @staticmethod
    def read(path: Path) -> dict[object, object]:
        loaded: object = json.loads(path.read_text() or "{}") if path.is_file() else {}
        return dict(loaded) if is_mapping(loaded) else {}

    @staticmethod
    def store(path: Path, settings: Mapping[object, object]) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(dict(settings), indent=2) + "\n")

    @staticmethod
    def partitioned(stored_hooks: object) -> tuple[dict[str, list[object]], list[tuple[str, str, Mapping[str, object]]]]:
        if not is_mapping(stored_hooks):
            return {}, []
        kept: dict[str, list[object]] = {}
        commands: list[tuple[str, str, Mapping[str, object]]] = []
        for event, blocks in stored_hooks.items():
            if not is_list(blocks):
                continue
            for block in blocks:
                kept_blocks, block_commands = ProgramHooks._partitioned_block(str(event), block)
                if kept_blocks:
                    kept.setdefault(str(event), []).extend(kept_blocks)
                commands.extend(block_commands)
        return kept, commands

    @staticmethod
    def _partitioned_block(event: str, block: object) -> tuple[list[object], list[tuple[str, str, Mapping[str, object]]]]:
        if not is_mapping(block) or not is_list(entries := block.get("hooks")):
            return [block], []
        kept_entries: list[object] = []
        commands: list[tuple[str, str, Mapping[str, object]]] = []
        for entry in entries:
            if not is_mapping(entry) or entry.get("type") != "command" or ProgramHooks.is_journals(entry):
                kept_entries.append(entry)
                continue
            commands.append((event, str(block.get("matcher", "")), {str(key): value for key, value in entry.items()}))
        if not kept_entries:
            return [], commands
        return [{**block, "hooks": kept_entries}], commands

    @staticmethod
    def without_journals(stored_hooks: object) -> dict[str, list[object]]:
        """The hooks a settings file stores under hooks, event by event, without the blocks that are the journal's."""
        return {str(event): [block for block in blocks if not ProgramHooks.is_journals(block)] for event, blocks in stored_hooks.items()
                if is_list(blocks)} if is_mapping(stored_hooks) else {}

    @staticmethod
    def is_journals(block: object) -> bool:
        return any(mark in json.dumps(block) for mark in JOURNAL_MARKS)
