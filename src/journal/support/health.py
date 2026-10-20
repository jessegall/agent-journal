import re
import subprocess

from journal.config import Config
from journal.support.kept_answer import KeptAnswer
from journal.features.mcp.support.health_report import HealthReport
from journal.features.mcp.support.known import Known

LINE = re.compile(r"^(?P<name>.+?): (?P<how>.+?) - (?P<mark>[✔✘!]) (?P<words>.*)$")
STATES = {"✔": "connected", "✘": "failed", "!": "needs_auth"}
FRESH_FOR = 3600.0
"""Seconds a check is kept: the program's check starts every server, which takes a while, and an add or a removal asks again."""


class Health:
    """How each server stands, as Claude Code's own check reports it: every server the program has, the journal's and the ones set up elsewhere alike."""

    def __init__(self, config: Config) -> None:
        self.config = config
        self._report = KeptAnswer(lambda: self.asked(), FRESH_FOR, HealthReport())

    def of_all(self) -> HealthReport:
        """The last answer, at once: the program's check takes seconds, so a request never waits on it."""
        return self._report.now()

    def fresh(self) -> HealthReport:
        """Asked anew, whatever the last answer: what a check from the page wants."""
        return self._report.fresh()

    def is_checking(self) -> bool:
        return self._report.is_asking()

    def recheck(self) -> None:
        """Asked again on a thread of its own after a change, the last answer given meanwhile."""
        self._report.forget()
        self._report.now()

    @property
    def checked_at(self) -> float:
        """When the program was last asked, as a timestamp; zero before the first time."""
        return self._report.asked_on

    def remove(self, name: str) -> bool:
        """A server the program has from elsewhere taken out through the program's own command, whichever scope holds it; the next check is fresh."""
        for scope in ("local", "project", "user"):
            run = subprocess.run(["claude", "mcp", "remove", name, "-s", scope], cwd=self.config.root, capture_output=True, text=True, timeout=60)
            if run.returncode == 0:
                self.recheck()
                return True
        return False

    def asked(self) -> HealthReport:
        try:
            out = subprocess.run(["claude", "mcp", "list"], cwd=self.config.root, capture_output=True, text=True, timeout=60).stdout
        except (OSError, subprocess.TimeoutExpired) as failed:
            return HealthReport(failure=str(failed))
        found = {}
        for line in out.splitlines():
            if match := LINE.match(line.strip()):
                found[match["name"]] = Known(match["name"], match["how"].replace(" (HTTP)", "").replace(" (SSE)", ""), STATES[match["mark"]], match["words"].strip())
        return HealthReport(found)
