import subprocess
from dataclasses import dataclass
from pathlib import Path

from journal.features.shell.support.progress import Progress
from journal.support.rejection import Rejection

TIMEOUT_SECONDS = 30


@dataclass(frozen=True)
class ScriptReader:
    """A named way to read outputs of one shape: a script of the project's, handed the output on its input, prints what matters."""

    name: str
    subject: str
    path: Path

    @classmethod
    def loaded(cls, path: Path) -> "ScriptReader":
        topic = next((line.removeprefix("#").strip() for line in path.read_text().splitlines() if line.startswith("#") and not line.startswith("#!")), "")
        return cls(path.stem, topic, path)

    def matches(self, command: str) -> bool:
        return False

    def read(self, lines: list[str]) -> list[str]:
        try:
            completed = subprocess.run(["sh", str(self.path)], input="\n".join(lines) + "\n", capture_output=True, text=True, timeout=TIMEOUT_SECONDS)
        except subprocess.TimeoutExpired as late:
            raise Rejection(f"reader {self.name} took more than {TIMEOUT_SECONDS} seconds") from late
        if completed.returncode != 0:
            raise Rejection(f"reader {self.name} failed with code {completed.returncode}: {completed.stderr.strip()[-300:]}")
        return completed.stdout.splitlines()

    def progress(self, lines: list[str]) -> Progress:
        return Progress.empty()
