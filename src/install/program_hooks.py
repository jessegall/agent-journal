import json
from collections.abc import Mapping, Sequence
from dataclasses import dataclass, field
from pathlib import Path

JOURNAL_MARKS = ("journal-hook", "hooks/hook.sh")


@dataclass(frozen=True)
class ProgramHooks:
    """One agent program's hook settings file: the journal's hooks in it are contents anew for every event the program
    sends, each running the hook program with the program's name and the project's root; the rest stays as it was."""

    program: str
    path: Path
    events: Sequence[str]
    timeout_seconds: int
    entry_fields: Mapping[str, object] = field(default_factory=lambda: {})

    def write(self, runner: str, root: Path) -> None:
        settings = json.loads(self.path.read_text() or "{}") if self.path.is_file() else {}
        hooks = {event: [block for block in blocks if not self.is_journals(block)] for event, blocks in settings.get("hooks", {}).items()}
        for event in self.events:
            hooks.setdefault(event, []).append({"matcher": "", "hooks": [{"type": "command", "command": f'{runner} {self.program} "{root}"', "timeout": self.timeout_seconds,
                                                                     **self.entry_fields}]})
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.path.write_text(json.dumps({**settings, "hooks": {event: blocks for event, blocks in hooks.items() if blocks}}, indent=2) + "\n")

    @staticmethod
    def is_journals(block: object) -> bool:
        return any(mark in json.dumps(block) for mark in JOURNAL_MARKS)
