from pathlib import Path


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
        return [line for i in self.recorded() for name in (f"{i}.out", f"{i}.err") for line in self.printed(name)]

    def printed(self, name: str) -> list[str]:
        path = self.folder / name
        return path.read_text(errors="replace").splitlines() if path.is_file() else []

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
