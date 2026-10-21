import re
import subprocess

from journal.config import Config
from journal.support.cached_answer import CachedAnswer
from journal.features.mcp.support.health_report import HealthReport
from journal.features.mcp.support.server_catalogue import ServerCatalogue

LINE = re.compile(r"^(?P<name>.+?): (?P<how>.+?) - (?P<mark>[✔✘!]) (?P<words>.*)$")
STATES = {"✔": "connected", "✘": "failed", "!": "needs_auth"}
HEALTH_VALIDITY_SECONDS = 3600.0


class Health:
    """How each server stands, as Claude Code's own check reports it: every server the program has, the journal's and the ones set up elsewhere alike."""

    def __init__(self, config: Config) -> None:
        self.config = config
        self._report = CachedAnswer(lambda: self.asked(), HEALTH_VALIDITY_SECONDS, HealthReport())

    def of_all(self) -> HealthReport:
        return self._report.now()

    def fresh(self) -> HealthReport:
        return self._report.fresh()

    def is_checking(self) -> bool:
        return self._report.is_asking()

    def recheck(self) -> None:
        self._report.forget()
        self._report.now()

    @property
    def checked_at(self) -> float:
        return self._report.asked_on

    def remove(self, name: str) -> bool:
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
        rows = {}
        for line in out.splitlines():
            if match := LINE.match(line.strip()):
                rows[match["name"]] = ServerCatalogue(match["name"], match["how"].replace(" (HTTP)", "").replace(" (SSE)", ""), STATES[match["mark"]], match["words"].strip())
        return HealthReport(rows)
