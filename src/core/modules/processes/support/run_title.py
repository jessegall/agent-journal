import re
from pathlib import Path
from re import Match

from core.modules.processes.models.reader import Reader
from core.modules.processes.models.process_part import ProcessPart

TOPIC = "{topic}"
TEMPORARY_TITLES = {"rm": "Removing files", "python": "Running Python", "python3": "Running Python"}


class RunTitle:
    """Names a run from its reader or first program without showing its script as a title."""

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
