from pathlib import Path

BLOCK = 65536
"""How many bytes the tail of a file is read by at first, from its end, growing until it holds the lines asked for."""


class OutputFiles:
    """What the runner left in an output's folder: the agent's own parts, what each printed, and how each ended."""

    def __init__(self, folder: Path) -> None:
        self.folder = folder

    def is_kept(self) -> bool:
        return (self.folder / "parts").is_file()

    def recorded(self) -> list[int]:
        """The parts that are the agent's own, not the shell's wrapping around them."""
        return [i for i, kind in enumerate((self.folder / "parts").read_text().splitlines()) if kind.startswith("R")]

    def lines(self) -> list[str]:
        """What the agent's parts printed, standard output then errors, part by part."""
        return [line for path in self.parts() for line in path.read_text(errors="replace").splitlines()]

    def last(self, n: int) -> list[str]:
        """The last n lines the agent's parts printed, read from the ends of their files, never a long file whole."""
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
        """The file's last n lines: a block from its end, read again larger until it holds more lines than n, so the first one, cut, is left out."""
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
        """The exit status of each of the agent's parts that has ended."""
        return [int(path.read_text()) for i in self.recorded() if (path := self.folder / f"{i}.status").is_file()]

    def is_running(self) -> bool:
        return not (self.folder / "done").is_file() and len(self.ran()) < len(self.recorded())

    def outcome(self) -> str:
        ran = self.ran()
        return "still running" if self.is_running() or not ran else self.ended(ran[-1])

    @staticmethod
    def ended(status: int) -> str:
        """How a command ended, in the words every line about an output uses."""
        return "finished" if status == 0 else f"failed with code {status}"
