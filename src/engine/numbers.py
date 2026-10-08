import shutil
from dataclasses import dataclass
from pathlib import Path
from typing import Callable

from engine import runtime
from engine.locks import held_file
from engine.stored import write_text

FOLDER = "numbers"
LOCK = ".lock"
ROWS = "rows"
EVENTS = "events"
BLOCK = 64


def rows(scope: str, type: str) -> str:
    return f"{ROWS}/{scope}/{type}"


def read_numbers(f: Path) -> list[int]:
    try:
        return [int(word) for word in f.read_text().split()]
    except (OSError, ValueError):
        return []


@dataclass(frozen=True)
class Block:
    next: int
    end: int

    @classmethod
    def read(cls, f: Path) -> "Block":
        found = read_numbers(f)
        return cls(*found) if len(found) == 2 else cls(0, 0)

    def is_spent(self) -> bool:
        return self.next >= self.end

    def drawn(self) -> "Block":
        return Block(self.next + 1, self.end)

    def write(self, f: Path) -> None:
        write_text(f, f"{self.next} {self.end}")


class Leases:
    """The record's hand-out of blocks: per sequence, the first number no writer has leased yet."""

    def __init__(self, root: Path):
        self.folder = Path(root) / "project" / FOLDER

    def lease(self, sequence: str, floor: int) -> Block:
        with held_file(self.folder / LOCK):
            start = max(self._next(sequence), floor, 1)
            write_text(self.folder / sequence, str(start + BLOCK))
        return Block(start, start + BLOCK)

    def seed(self, sequence: str, next: int) -> None:
        with held_file(self.folder / LOCK):
            write_text(self.folder / sequence, str(max(self._next(sequence), next)))

    def _next(self, sequence: str) -> int:
        return (read_numbers(self.folder / sequence) or [1])[0]

    def forget(self, scope: str) -> None:
        with held_file(self.folder / LOCK):
            shutil.rmtree(self.folder / ROWS / scope, ignore_errors=True)


class Numbers:
    """Row and event numbers drawn from the blocks this machine leases, so two writers never hand out the same one."""

    def __init__(self, held: Path, leases: Leases):
        self.held = held
        self.leases = leases

    @classmethod
    def of(cls, root: Path) -> "Numbers":
        return cls(runtime.folder(root) / FOLDER, Leases(root))

    def draw(self, sequence: str, floor: Callable[[], int]) -> int:
        with held_file(self.held / LOCK):
            block = self._block(sequence, floor)
            block.drawn().write(self.held / sequence)
        return block.next

    def peek(self, sequence: str, floor: Callable[[], int]) -> int:
        with held_file(self.held / LOCK):
            return self._block(sequence, floor).next

    def _block(self, sequence: str, floor: Callable[[], int]) -> Block:
        block = Block.read(self.held / sequence)
        if not block.is_spent():
            return block
        leased = self.leases.lease(sequence, floor())
        leased.write(self.held / sequence)
        return leased

    def forget(self, scope: str) -> None:
        with held_file(self.held / LOCK):
            shutil.rmtree(self.held / ROWS / scope, ignore_errors=True)
        self.leases.forget(scope)
