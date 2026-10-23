import re
from dataclasses import dataclass, replace
from pathlib import Path

from journal.features.shell.support.progress import Progress
from journal.features.shell.support.step_tally import StepTally
from journal.features.shell.support.reader_commands import COMMANDS_PREFIX, ReaderCommands
from journal.models.command_output import FAILED, FINISHED
from journal.support.rejection import Rejection

PROGRESS_PREFIX = "progress: "
LABEL_PREFIX = "label: "
STEP_PREFIX = "step: "
TOPIC_PREFIX = "topic: "
FINISHED_PREFIX = "finished: "
FAILED_PREFIX = "failed: "
PREFIXES = (PROGRESS_PREFIX, LABEL_PREFIX, COMMANDS_PREFIX, STEP_PREFIX, TOPIC_PREFIX, FINISHED_PREFIX, FAILED_PREFIX)


@dataclass(frozen=True)
class Reader:
    """A named way to read outputs of one shape: the lines a pattern picks, with their numbers, and the lines its finished and failed patterns pick once the command ended so, how far the command has come by the last match of a progress pattern, the commands whose output it reads, and what a run is about, picked from its command line by a topic pattern."""

    name: str
    subject: str
    pattern: str
    progress_pattern: str = ""
    label: str = ""
    commands: ReaderCommands = ReaderCommands()
    step_pattern: str = ""
    topic_pattern: str = ""
    finished_pattern: str = ""
    failed_pattern: str = ""

    def revised(self, **changes: object) -> "Reader":
        return replace(self, **{name: value for name, value in changes.items() if value is not None})

    @classmethod
    def loaded(cls, path: Path) -> "Reader":
        lines = path.read_text().splitlines()
        if len(lines) < 2:
            raise Rejection(f"reader {path.stem} needs two lines: '# what it picks', then its pattern")
        settings = {prefix: line.removeprefix(prefix) for line in lines[2:] for prefix in PREFIXES if line.startswith(prefix)}
        return cls(path.stem, lines[0].removeprefix("#").strip(), lines[1], settings.get(PROGRESS_PREFIX, ""), settings.get(LABEL_PREFIX, ""), ReaderCommands.parsed(settings.get(COMMANDS_PREFIX, "")), settings.get(STEP_PREFIX, ""), settings.get(TOPIC_PREFIX, ""), settings.get(FINISHED_PREFIX, ""), settings.get(FAILED_PREFIX, ""))

    def text(self) -> str:
        values = (self.progress_pattern, self.label, self.commands.text(), self.step_pattern, self.topic_pattern, self.finished_pattern, self.failed_pattern)
        extra = [f"{prefix}{value}" for prefix, value in zip(PREFIXES, values) if value]
        return "\n".join([f"# {self.subject}", self.pattern, *extra]) + "\n"

    def topic(self, line: str) -> str:
        if not self.topic_pattern:
            return ""
        topics = [next((group for group in match.groups() if group), match.group(0)) if match.groups() else match.group(0) for match in re.finditer(self.topic_pattern, line)]
        return ", ".join(dict.fromkeys(Path(item.strip("'\"")).name if "/" in item else item.strip("'\"") for item in topics))

    def variant(self, stage: str) -> "Reader":
        pattern = {FINISHED: self.finished_pattern, FAILED: self.failed_pattern}.get(stage, "")
        return replace(self, pattern=pattern) if pattern else self

    def is_counting(self) -> bool:
        return bool(self.progress_pattern)

    def matches(self, command: str) -> bool:
        return self.pattern in command

    def read(self, lines: list[str]) -> list[str]:
        return [f"{i}: {line}" for i, line in self.picked_lines(lines)]

    def card_lines(self, lines: list[str]) -> list[str]:
        return [line for _, line in self.picked_lines(lines)]

    def picked_lines(self, lines: list[str]) -> list[tuple[int, str]]:
        rows = re.compile(self.pattern)
        return [(i, line) for i, line in enumerate(lines, 1) if rows.search(line)]

    def progress(self, lines: list[str]) -> Progress:
        return Progress.found(self.progress_pattern, self.label, lines, self.step_pattern)

    def tally(self, lines: list[str]) -> StepTally:
        return StepTally.counted(self.step_pattern, self.progress_pattern, lines)
