import subprocess
import time

from journal.config import Config
from journal.features.git.support.git_snapshot import GitSnapshot
from journal.models.agent import Agent

SHOWN = 20
FRESH_SECONDS = 15.0


class GitSnapshotReader:
    """Reads the git feature's part of the Snapshot for an agent: the uncommitted files, asked of git at most once every FRESH_SECONDS, since every event reads the snapshot and a status older than that is as good as fresh."""

    def __init__(self, config: Config) -> None:
        self.config = config
        self.read_at = 0.0
        self.last_uncommitted = "none"

    def read(self, agent: Agent) -> GitSnapshot:
        return GitSnapshot(uncommitted=self.uncommitted())

    def uncommitted(self) -> str:
        if time.monotonic() - self.read_at < FRESH_SECONDS:
            return self.last_uncommitted
        self.last_uncommitted, self.read_at = self.status_files(), time.monotonic()
        return self.last_uncommitted

    def status_files(self) -> str:
        try:
            done = subprocess.run(["git", "status", "--short"], cwd=self.config.root, capture_output=True, text=True, timeout=3)
        except (OSError, subprocess.SubprocessError):
            return "none"
        files = [line[3:] for line in done.stdout.splitlines() if line.strip()] if done.returncode == 0 else []
        more = f" and {len(files) - SHOWN} more" if len(files) > SHOWN else ""
        return ", ".join(files[:SHOWN]) + more if files else "none"
