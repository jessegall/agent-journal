import re
from dataclasses import dataclass
from pathlib import Path

from engine import runtime
from engine.stored import read_json

TOKEN = re.compile(r"journal_step\(\) \{ __js=\$\?; .*?step\?token=(\w+)&")


@dataclass(frozen=True)
class SteppedCall:
    """A Bash call the hook cut into parts: whose it is and what it asked for."""

    session: str = ""
    env: str = ""
    command: str = ""
    parts: tuple[str, ...] = ()

    @classmethod
    def from_json(cls, raw: dict) -> "SteppedCall":
        return cls(raw.get("session", ""), raw.get("env", ""), raw.get("command", ""), tuple(raw.get("parts") or ()))

    def to_json(self) -> dict:
        return {"session": self.session, "env": self.env, "command": self.command, "parts": list(self.parts)}


def file_of(root: Path, token: str) -> Path:
    return runtime.folder(root) / "steps" / f"{token}.json"


def call_of(root: Path, token: str) -> SteppedCall | None:
    raw = read_json(file_of(root, token), dict, {})
    return SteppedCall.from_json(raw) if raw else None


def original_of(root: Path, command: str) -> str:
    """The command the agent asked for, when what ran was its stepped form; otherwise the command itself."""
    found = TOKEN.search(command)
    stepped = call_of(root, found[1]) if found else None
    return stepped.command if stepped else command
