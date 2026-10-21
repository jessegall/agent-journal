import json
from dataclasses import dataclass, replace
from pathlib import Path


@dataclass(frozen=True)
class ProgramSettings:
    """An agent program's settings file: its hooks by event, and everything else in it, kept as it was."""

    rest: dict
    hooks: dict | None = None

    @classmethod
    def read(cls, path: Path) -> "ProgramSettings":
        data = json.loads(path.read_text() or "{}") if path.is_file() else {}
        hooks = data.get("hooks")
        return cls({key: value for key, value in data.items() if key != "hooks"}, hooks if isinstance(hooks, dict) else None)

    def to_json(self) -> dict:
        if self.hooks is None:
            return self.rest
        return {**self.rest, "hooks": self.hooks}

    def stored(self) -> "ProgramSettings":
        if self.hooks is None:
            return self
        ours = {event: [block for block in blocks if self.is_journals(block)] for event, blocks in self.hooks.items()}
        return replace(self, hooks={event: blocks for event, blocks in ours.items() if blocks})

    def with_hooks_of(self, other: "ProgramSettings") -> "ProgramSettings":
        return replace(self, hooks=other.hooks or {})

    @staticmethod
    def is_journals(block: dict) -> bool:
        return "journal/hooks/hook.sh" in json.dumps(block)
