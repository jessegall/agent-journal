import re
import subprocess

from core.modules.processes.models.enums.reader_type import ReaderType
from core.modules.processes.models.reader import Reader

SCRIPT_SECONDS = 30
STAGE_VARIABLE = "JOURNAL_OUTPUT_STAGE"


class ReaderRun:
    """Applies a reader to the text of an output: a pattern picks the lines that match with their numbers, a
    script of the project is handed the output on its input, with the stage of the run in
    JOURNAL_OUTPUT_STAGE, under a time limit; a pattern also finds the last match of the summary."""

    def __init__(self, limit_seconds: float = SCRIPT_SECONDS) -> None:
        self.limit_seconds = limit_seconds

    def lines(self, reader: Reader, text: str, stage: str, first_number: int = 1) -> list[str]:
        if reader.type is ReaderType.SCRIPT:
            return self.script_lines(reader, text, stage)
        if not reader.lines_pattern:
            return []
        pattern = re.compile(reader.lines_pattern)
        return [f"{number}: {line}" for number, line in enumerate(text.splitlines(), first_number) if pattern.search(line)]

    def progress(self, reader: Reader, text: str, current: int) -> int:
        if not reader.progress_pattern:
            return current
        pattern = re.compile(reader.progress_pattern)
        hits = [hit for line in text.splitlines() if (hit := pattern.search(line))]
        if not hits or not hits[-1].groups() or not (hits[-1].group(1) or "").isdigit():
            return current
        return min(100, int(hits[-1].group(1)))

    def summary(self, reader: Reader, text: str) -> str:
        if not reader.summary_pattern:
            return ""
        pattern = re.compile(reader.summary_pattern)
        hits = [hit for line in text.splitlines() if (hit := pattern.search(line))]
        if not hits:
            return ""
        last = hits[-1]
        return " ".join(group for group in last.groups() if group) if last.groups() else last.group(0)

    def script_lines(self, reader: Reader, text: str, stage: str) -> list[str]:
        try:
            outcome = subprocess.run([reader.script], input=text, capture_output=True, text=True, timeout=self.limit_seconds, env={STAGE_VARIABLE: stage, "PATH": "/usr/bin:/bin"}, check=False)
        except subprocess.TimeoutExpired:
            return [f"reader {reader.name} did not finish within {self.limit_seconds:g} seconds"]
        except OSError as error:
            return [f"reader {reader.name} could not run {reader.script}: {error.strerror}"]
        return outcome.stdout.splitlines()
