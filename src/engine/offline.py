import json
import uuid
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Callable

from engine import runtime
from engine.disk import read_json
from engine.locks import held_file
from engine.stored import append_text, write_json, write_text

WAITING = "waiting-writes.jsonl"
APPLIED = "applied-writes.json"
KEPT_KEYS = 5000


@dataclass(frozen=True)
class Write:
    """One change made while the server was away, with a key of its own so it is applied once however often it is sent."""

    key: str
    scope: str
    type: str
    word: str
    args: list = field(default_factory=list)
    named: dict = field(default_factory=dict)


class Waiting:
    """What this machine wrote while the server was away, kept in the order it was written until the server takes it."""

    def __init__(self, root: Path) -> None:
        self.file = runtime.folder(root) / WAITING
        self.lock = self.file.with_suffix(".lock")

    def hold(self, scope: str, type_: str, word: str, args: list | None = None, named: dict | None = None) -> Write:
        held = Write(uuid.uuid4().hex, scope, type_, word, args or [], named or {})
        with held_file(self.lock):
            append_text(self.file, json.dumps(asdict(held)) + "\n")
        return held

    def waiting(self) -> list[Write]:
        if not self.file.is_file():
            return []
        return [Write(**json.loads(line)) for line in self.file.read_text().splitlines() if line.strip()]

    def flush(self, send: Callable[[Write], bool]) -> int:
        """Sends the waiting writes oldest first and stops at the first one the server does not take, so none overtakes another; answers how many went."""
        with held_file(self.lock):
            waiting = self.waiting()
            sent = 0
            try:
                for held in waiting:
                    if not send(held):
                        break
                    sent += 1
            finally:
                write_text(self.file, "".join(json.dumps(asdict(held)) + "\n" for held in waiting[sent:]))
        return sent


class Applied:
    """On the server: the keys of the writes it has already applied, so one sent again after a lost answer is not applied twice."""

    def __init__(self, folder: Path) -> None:
        self.file = Path(folder) / APPLIED
        self.lock = self.file.with_suffix(".lock")

    def apply(self, held: Write, run: Callable[[Write], None]) -> bool:
        """Runs the write unless its key was applied before; answers true either way, since the sender may let go of it."""
        with held_file(self.lock):
            keys = read_json(self.file, list, [])
            if held.key not in keys:
                run(held)
                write_json(self.file, [*keys, held.key][-KEPT_KEYS:])
        return True
