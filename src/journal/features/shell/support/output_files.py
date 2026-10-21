import shutil
from pathlib import Path

from journal.features.shell.support.part import Part
from journal.support.writes import Writes

BLOCK = 65536


class OutputFiles:
    """An output's folder as the runner writes and reads it: the line and its parts, what each printed, how each ended, its number, and whether the chain is done or moved to the background."""

    def __init__(self, folder: Path) -> None:
        self.folder = folder

    def is_kept(self) -> bool:
        return (self.folder / "parts").is_file()

    def recorded(self) -> list[int]:
        return [i for i, kind in enumerate((self.folder / "parts").read_text().splitlines()) if kind.startswith("R")]

    def lines(self) -> list[str]:
        return [line for path in self.parts() for line in path.read_text(errors="replace").splitlines()]

    def last(self, n: int) -> list[str]:
        found: list[str] = []
        for path in reversed(self.parts()):
            found = self.tail_of(path, n - len(found)) + found
            if len(found) >= n:
                break
        return found[-n:]

    def parts(self) -> list[Path]:
        return [path for i in self.recorded() for name in (f"{i}.out", f"{i}.err") if (path := self.folder / name).is_file()]

    @staticmethod
    def tail_of(path: Path, n: int) -> list[str]:
        size, block = path.stat().st_size, BLOCK
        with path.open("rb") as file:
            while True:
                start = max(0, size - block)
                file.seek(start)
                lines = file.read().decode(errors="replace").splitlines()
                if start == 0 or len(lines) > n:
                    return lines[-n:] if n > 0 else []
                block *= 4

    def ran(self) -> list[int]:
        return [int(path.read_text()) for i in self.recorded() if (path := self.folder / f"{i}.status").is_file()]

    def is_running(self) -> bool:
        return not (self.folder / "done").is_file() and len(self.ran()) < len(self.recorded())

    def outcome(self) -> str:
        ran = self.ran()
        return "still running" if self.is_running() or not ran else self.ended(ran[-1])

    @staticmethod
    def ended(status: int) -> str:
        return "finished" if status == 0 else f"failed with code {status}"

    def split_into(self, line: str, parts: list[Part]) -> None:
        self.folder.mkdir(parents=True, exist_ok=True)
        (self.folder / "line").write_text(line)
        for i, part in enumerate(parts):
            (self.folder / f"{i}.part").write_text(part.uncut().text)
            if part.cut():
                (self.folder / f"{i}.cut").write_text(part.cut_command())
        (self.folder / "parts").write_text("".join(part.kind() + ("w" if part.recorded and Writes.part(part.text) else "-") + "\n" for part in parts))

    def kinds(self) -> list[str]:
        return (self.folder / "parts").read_text().splitlines()

    def part_text(self, i: int) -> str:
        return (self.folder / f"{i}.part").read_text()

    def cut_of(self, i: int) -> str:
        path = self.folder / f"{i}.cut"
        return path.read_text() if path.is_file() else ""

    def number(self) -> int:
        path = self.folder / "number"
        return int(path.read_text()) if path.is_file() else 0

    def numbered(self, number: int) -> None:
        (self.folder / "number").write_text(str(number))

    def has_ended(self, i: int) -> bool:
        return (self.folder / f"{i}.status").is_file()

    def status_of(self, i: int) -> int:
        return int((self.folder / f"{i}.status").read_text())

    def ended_with(self, i: int, status: int) -> None:
        (self.folder / f"{i}.status").write_text(str(status))

    def printed(self, i: int) -> str:
        return "".join(path.read_text(errors="replace") for name in (f"{i}.out", f"{i}.err") if (path := self.folder / name).is_file())

    def is_done(self) -> bool:
        return (self.folder / "done").is_file()

    def done(self, status: int) -> None:
        (self.folder / "done").write_text(str(status))

    def is_moved(self) -> bool:
        return (self.folder / "moved").is_file()

    def moved(self) -> None:
        (self.folder / "moved").touch()

    def size(self) -> int:
        return sum(path.stat().st_size for path in self.folder.glob("*.out")) + sum(path.stat().st_size for path in self.folder.glob("*.err"))

    def has_cut(self) -> bool:
        return any(self.folder.glob("*.cut"))

    def remove(self) -> None:
        shutil.rmtree(self.folder, ignore_errors=True)
