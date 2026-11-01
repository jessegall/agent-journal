import re
from re import Match

from core.modules.processes.models.process import Process
from core.modules.processes.models.reader import Reader

TOPIC = "{topic}"


class RunTitle:
    """What a run's card is called, from its reader: the reader's title, with the topic its pattern finds in
    the command line put in place of {topic}, or after it."""

    @staticmethod
    def title(reader: Reader | None, process: Process) -> str:
        if reader is None or not reader.title:
            return ""
        matches = re.search(reader.topic_pattern, process.line) if reader.topic_pattern else None
        topic = RunTitle.matched_topic(matches)
        if TOPIC in reader.title:
            return reader.title.replace(TOPIC, topic) if topic else reader.title.replace(TOPIC, "").strip()
        return f"{reader.title}: {topic}" if topic else reader.title

    @staticmethod
    def matched_topic(matches: Match[str] | None) -> str:
        if matches is None:
            return ""
        return matches.group(1) if matches.groups() else matches.group(0)
