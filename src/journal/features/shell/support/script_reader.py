import os
import subprocess
from dataclasses import dataclass, replace
from pathlib import Path

from journal.features.shell.support.progress import Progress
from journal.features.shell.support.step_tally import StepTally
from journal.features.shell.support.reader_commands import COMMANDS_PREFIX, ReaderCommands
from journal.models.command_output import ACTIVE
from journal.support.rejection import Rejection

TIMEOUT_SECONDS = 30
STAGE_VARIABLE = "JOURNAL_OUTPUT_STAGE"


@dataclass(frozen=True)
class ScriptReader:
    """A named way to read outputs of one shape: a script of the project's, handed the output on its input and in JOURNAL_OUTPUT_STAGE whether the command is running, finished or failed, prints what matters."""

    name: str
    subject: str
    path: Path
    commands: ReaderCommands = ReaderCommands()
    label: str = ""
    topic_pattern: str = ""
    stage: str = ACTIVE

    def topic(self, line: str) -> str:
        return ""

    @classmethod
    def loaded(cls, path: Path) -> "ScriptReader":
        notes = [line.removeprefix("#").strip() for line in path.read_text().splitlines() if line.startswith("#") and not line.startswith("#!")]
        commands = next((note.removeprefix(COMMANDS_PREFIX) for note in notes if note.startswith(COMMANDS_PREFIX)), "")
        topic = next((note for note in notes if not note.startswith(COMMANDS_PREFIX)), "")
        return cls(path.stem, topic, path, ReaderCommands.parsed(commands))

    def matches(self, command: str) -> bool:
        return False

    def variant(self, stage: str) -> "ScriptReader":
        return replace(self, stage=stage)

    def is_counting(self) -> bool:
        return False

    def read(self, lines: list[str]) -> list[str]:
        try:
            completed = subprocess.run(["sh", str(self.path)], input="\n".join(lines) + "\n", env={**os.environ, STAGE_VARIABLE: self.stage}, capture_output=True, text=True, timeout=TIMEOUT_SECONDS)
        except subprocess.TimeoutExpired as late:
            raise Rejection(f"reader {self.name} took more than {TIMEOUT_SECONDS} seconds") from late
        if completed.returncode != 0:
            raise Rejection(f"reader {self.name} failed with code {completed.returncode}: {completed.stderr.strip()[-300:]}")
        return completed.stdout.splitlines()

    def card_lines(self, lines: list[str]) -> list[str]:
        return self.read(lines)

    def progress(self, lines: list[str]) -> Progress:
        return Progress.empty()

    def tally(self, lines: list[str]) -> StepTally:
        return StepTally(0, 0)
