from dataclasses import dataclass


@dataclass(frozen=True)
class TitledRun:
    """A run of the agent's by its number, the title its card shows, the line the card shows, the topic its reader picks from that line, whether its command still runs, and whether that reader ships with the journal, whose titles the agent cannot change."""

    id: int
    title: str
    line: str
    topic: str
    is_running: bool
    shipped_reader: bool = False

    def is_flagged(self) -> bool:
        return any(len(word) > 1 and word[0] == "-" or word.startswith(("/", "~/", "./", "../")) for word in self.title.split())

    def clashes(self, run: "TitledRun") -> bool:
        return self.title == run.title and self.line != run.line and not self.topic and not run.topic and not self.shipped_reader and not run.shipped_reader
