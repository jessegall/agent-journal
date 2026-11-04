import re
from pathlib import Path
from re import Match

from core.modules.processes.models.reader import Reader
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.models.process import Process
from core.modules.processes.models.output import Output
from core.modules.processes.models.enums.process_state import ProcessState
from core.base.driver.command_category import CommandCategory
from core.modules.processes.support.reader_judge import ReaderJudge

TOPIC = "{topic}"
TEMPORARY_TITLES = {"rm": "Removing files", "python": "Running Python", "python3": "Running Python"}


class RunTitle:
    """Names a run from its reader or first program without showing its script as a title."""

    @staticmethod
    def tests(process: Process, output: Output | None, reader: Reader | None) -> str:
        title = reader.title if reader and not ReaderJudge.fields_missing(reader, CommandCategory.TEST_RUN) else "tests"
        title = title.removeprefix("Running ")
        if process.queued_at is not None:
            return f"Queued: {title}"
        if process.state in (ProcessState.RUNNING, ProcessState.BACKGROUND):
            return f"Running {title}"
        count = f"{output.test_count} " if output and output.test_count else ""
        return f"Ran {count}{title}"

    @staticmethod
    def temporary(part: ProcessPart | None) -> str:
        if part is None:
            return "Running a command"
        program = Path(part.program).name
        return TEMPORARY_TITLES.get(program, f"Running {program}")

    @staticmethod
    def is_descriptive(title: str, command: str) -> bool:
        return bool(title.strip()) and title.strip() != command.strip()

    @staticmethod
    def title(reader: Reader | None, command: str) -> str:
        if reader is None or not reader.title:
            return ""
        matches = re.search(reader.topic_pattern, command) if reader.topic_pattern else None
        topic = RunTitle.matched_topic(matches)
        if TOPIC in reader.title:
            return reader.title.replace(TOPIC, topic) if topic else reader.title.replace(TOPIC, "").strip()
        return f"{reader.title}: {topic}" if topic else reader.title

    @staticmethod
    def matched_topic(matches: Match[str] | None) -> str:
        if matches is None:
            return ""
        return matches.group(1) if matches.groups() else matches.group(0)
