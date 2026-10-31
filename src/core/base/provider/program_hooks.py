import json
from collections.abc import Mapping, Sequence
from dataclasses import dataclass, field
from pathlib import Path

from core.base.provider.provider import Provider
from core.base.type_guards import is_list, is_mapping

JOURNAL_MARKS = ("journal-hook", "hooks/hook.sh")
HOOK_TIMEOUT_SECONDS = 60


@dataclass(frozen=True)
class ProgramHooks:
    """One agent program's hook settings file: the journal's hooks in it are replaced by one per event the
    program sends, each running the hook program with the program's name and the project root, beside the settings its
    provider adds; the rest stays as it was."""

    program: str
    path: Path
    events: Sequence[str]
    timeout_seconds: int
    entry_fields: Mapping[str, object] = field(default_factory=lambda: {})
    provider: type[Provider] | None = None

    @classmethod
    def hooks(cls, provider: type[Provider], folder: Path) -> "ProgramHooks":
        return cls(provider.name, folder / provider.hook_file.path, list(provider.hook_events), HOOK_TIMEOUT_SECONDS, provider.hook_file.entry_values, provider)

    def write(self, runner: str, root: Path) -> None:
        settings = self.settings()
        stored_hooks = settings.get("hooks")
        hooks: dict[str, list[object]] = {str(event): [block for block in blocks if not self.is_journals(block)] for event, blocks in stored_hooks.items()
                                          if is_list(blocks)} if is_mapping(stored_hooks) else {}
        for event in self.events:
            hooks.setdefault(event, []).append({"matcher": "", "hooks": [{"type": "command", "command": f'{runner} {self.program} "{root}"', "timeout": self.timeout_seconds,
                                                                     **self.entry_fields}]})
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.path.write_text(json.dumps({**settings, **(self.provider.hook_settings(runner, root) if self.provider else {}), "hooks": {event: blocks for event, blocks in hooks.items() if blocks}}, indent=2) + "\n")

    def is_complete(self) -> bool:
        stored_hooks = self.settings().get("hooks")
        return is_mapping(stored_hooks) and all(is_list(blocks := stored_hooks.get(event)) and any(self.is_journals(block) for block in blocks)
                                                for event in self.events)

    def settings(self) -> dict[object, object]:
        loaded: object = json.loads(self.path.read_text() or "{}") if self.path.is_file() else {}
        return dict(loaded) if is_mapping(loaded) else {}

    @staticmethod
    def is_journals(block: object) -> bool:
        return any(mark in json.dumps(block) for mark in JOURNAL_MARKS)
