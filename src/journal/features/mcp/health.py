import re
import subprocess

from journal.config import Config

LINE = re.compile(r"^(?P<name>[^:]+): .* - (?P<mark>[✔✘!]) (?P<words>.*)$")
STATES = {"✔": "connected", "✘": "failed", "!": "needs_auth"}


class Health:
    """How each server stands, as Claude Code's own check reports it: connected, failed with a reason, or waiting to be let in."""

    def __init__(self, config: Config) -> None:
        self.config = config

    def of_all(self) -> dict[str, tuple[str, str]]:
        try:
            out = subprocess.run(["claude", "mcp", "list"], cwd=self.config.root, capture_output=True, text=True, timeout=60).stdout
        except (OSError, subprocess.TimeoutExpired) as failed:
            return {"*": ("failed", str(failed))}
        found = {}
        for line in out.splitlines():
            if match := LINE.match(line.strip()):
                found[match["name"].strip()] = (STATES[match["mark"]], match["words"].strip())
        return found
