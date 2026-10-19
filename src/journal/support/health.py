import re
import subprocess

from journal.config import Config
from journal.support.kept_answer import KeptAnswer
from journal.features.mcp.support.health_report import HealthReport
from journal.features.mcp.support.known import Known

LINE = re.compile(r"^(?P<name>.+?): (?P<how>.+?) - (?P<mark>[✔✘!]) (?P<words>.*)$")
STATES = {"✔": "connected", "✘": "failed", "!": "needs_auth"}
FRESH_FOR = 60.0
"""Seconds a check is good for: the program's check starts every server, which takes a while."""


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

    @property
    def checked_at(self) -> float:
        """When the program was last asked, as a timestamp; nought before the first time."""
        return self._report.asked_on

    def remove(self, name: str) -> bool:
        """A server the program has from elsewhere taken out through the program's own command, whichever scope holds it; the next check is fresh."""
        for scope in ("local", "project", "user"):
            run = subprocess.run(["claude", "mcp", "remove", name, "-s", scope], cwd=self.config.root, capture_output=True, text=True, timeout=60)
            if run.returncode == 0:
                self._report.forget()
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
