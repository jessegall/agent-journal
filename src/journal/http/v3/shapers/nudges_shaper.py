from journal.http.v3.shapers.shaper import Shaper
from journal.http.v3.v3_row import AGENT, SYSTEM, V3Row
from journal.models.environment import Environment
from journal.repositories.entries import Entries


class NudgesShaper(Shaper):
    """A nudge entry as version 3's nudge row."""

    type = "nudge"

    def __init__(self, entries: Entries) -> None:
        self.entries = entries

    def rows(self, environment: Environment) -> list[V3Row]:
        rows = []
        for e in reversed(self.entries.of_kind(environment.id, "nudge", 200)):
            feature, _, line = e.data.get("key", ".").partition(".")
            rows.append(V3Row.of("nudge", e, title=e.data.get("line", ""), seen=[SYSTEM, AGENT], data={"feature": feature, "line": line, "session": e.data.get("session", ""), "private": False, "whisper": False, "lead": False, "yields": False}))
        return rows
