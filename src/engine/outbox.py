import json
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Callable

from engine import runtime
from engine.locks import held_file
from engine.stored import append_text, write_text
from resources.base import SYSTEM

OUTBOX = "requests.jsonl"


@dataclass(frozen=True)
class Request:
    """A write meant for an environment or the project, run by whichever machine writes there."""

    env: str
    type: str
    word: str
    args: list = field(default_factory=list)
    named: dict = field(default_factory=dict)
    actor: str = SYSTEM

    def line(self) -> str:
        return " ".join([self.type, self.word, *map(str, self.args)])


class Outbox:
    """This machine's requests waiting for the machine that holds their scope."""

    def __init__(self, root: Path):
        self.file = runtime.folder(root) / OUTBOX
        self.lock = self.file.with_suffix(".lock")

    def send(self, asked: Request) -> None:
        with held_file(self.lock):
            append_text(self.file, json.dumps(asdict(asked)) + "\n")

    def waiting(self) -> list[Request]:
        if not self.file.is_file():
            return []
        return [Request(**json.loads(line)) for line in self.file.read_text().splitlines() if line.strip()]

    def take(self, runnable: Callable[[Request], bool]) -> list[Request]:
        if not self.file.is_file():
            return []
        with held_file(self.lock):
            waiting = self.waiting()
            taken = [runnable(asked) for asked in waiting]
            write_text(self.file, "".join(json.dumps(asdict(asked)) + "\n" for asked, now in zip(waiting, taken) if not now))
        return [asked for asked, now in zip(waiting, taken) if now]
