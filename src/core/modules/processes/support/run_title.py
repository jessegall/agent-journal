import re

from core.modules.processes.models.process import Process
from core.modules.processes.models.reader import Reader

TOPIC = "{topic}"


class RunTitle:
    """What a run's card is called, from its reader: the reader's title, with the topic its pattern finds in the command line put in place of {topic}, or after it."""

    @staticmethod
    def of(reader: Reader | None, process: Process) -> str:
        if reader is None or not reader.title:
            return ""
        found = re.search(reader.topic_pattern, process.line) if reader.topic_pattern else None
        topic = (found.group(1) if found.groups() else found.group(0)) if found else ""
        if TOPIC in reader.title:
            return reader.title.replace(TOPIC, topic) if topic else reader.title.replace(TOPIC, "").strip()
        return f"{reader.title}: {topic}" if topic else reader.title
