import subprocess
from dataclasses import dataclass
from pathlib import Path

from journal.support.refused import Refused

TIMEOUT = 30


@dataclass(frozen=True)
class ScriptReader:
    """A named way to read outputs of one shape: a script of the project's, handed the output on its input, prints what matters."""

    name: str
    about: str
    path: Path

    @classmethod
    def from_file(cls, path: Path) -> "ScriptReader":
        about = next((line.removeprefix("#").strip() for line in path.read_text().splitlines() if line.startswith("#") and not line.startswith("#!")), "")
        return cls(path.stem, about, path)

    def matches(self, command: str) -> bool:
        return False

    def read(self, lines: list[str]) -> list[str]:
        try:
            ran = subprocess.run(["sh", str(self.path)], input="\n".join(lines) + "\n", capture_output=True, text=True, timeout=TIMEOUT)
        except subprocess.TimeoutExpired as late:
            raise Refused(f"reader {self.name} took more than {TIMEOUT} seconds") from late
        if ran.returncode != 0:
            raise Refused(f"reader {self.name} failed with code {ran.returncode}: {ran.stderr.strip()[-300:]}")
        return ran.stdout.splitlines()
