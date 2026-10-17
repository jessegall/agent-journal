import re
import subprocess
import time

from journal.config import Config
from journal.features.mcp.known import Known

LINE = re.compile(r"^(?P<name>.+?): (?P<how>.+?) - (?P<mark>[✔✘!]) (?P<words>.*)$")
STATES = {"✔": "connected", "✘": "failed", "!": "needs_auth"}
FRESH_FOR = 60.0
"""Seconds a check is good for: the program's check starts every server, which takes a while."""


class Health:
    """How each server stands, as Claude Code's own check reports it: every server the program has, the journal's and the ones set up elsewhere alike."""

    def __init__(self, config: Config) -> None:
        self.config = config
        self._found: dict[str, Known] = {}
        self._at = 0.0

    def of_all(self) -> dict[str, Known]:
        """The answer of the last minute, else a fresh one."""
        if time.time() - self._at < FRESH_FOR:
            return self._found
        return self.fresh()

    def fresh(self) -> dict[str, Known]:
        """Asked anew, whatever the last answer: what a check from the page wants."""
        self._found, self._at = self.asked(), time.time()
        return self._found

    @property
    def checked_at(self) -> float:
        """When the program was last asked, as a timestamp; nought before the first time."""
        return self._at

    def remove(self, name: str) -> bool:
        """A server the program has from elsewhere taken out through the program's own command, whichever scope holds it; the next check is fresh."""
        for scope in ("local", "project", "user"):
            run = subprocess.run(["claude", "mcp", "remove", name, "-s", scope], cwd=self.config.root, capture_output=True, text=True, timeout=60)
            if run.returncode == 0:
                self._at = 0.0
                return True
        return False

    def asked(self) -> dict[str, Known]:
        try:
            out = subprocess.run(["claude", "mcp", "list"], cwd=self.config.root, capture_output=True, text=True, timeout=60).stdout
        except (OSError, subprocess.TimeoutExpired) as failed:
            return {"*": Known("*", "", "failed", str(failed))}
        found = {}
        for line in out.splitlines():
            if match := LINE.match(line.strip()):
                found[match["name"]] = Known(match["name"], match["how"].replace(" (HTTP)", "").replace(" (SSE)", ""), STATES[match["mark"]], match["words"].strip())
        return found
