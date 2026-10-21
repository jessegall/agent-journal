import subprocess

from journal.config import Config
from journal.features.git.support.git_snapshot import GitSnapshot
from journal.models.agent import Agent

SHOWN = 20


class GitSnapshotReader:
    """Reads the git feature's part of the Snapshot for an agent."""

    def __init__(self, config: Config) -> None:
        self.config = config

    def read(self, agent: Agent) -> GitSnapshot:
        return GitSnapshot(uncommitted=self.uncommitted())

    def uncommitted(self) -> str:
        try:
            done = subprocess.run(["git", "status", "--short"], cwd=self.config.root, capture_output=True, text=True, timeout=3)
        except (OSError, subprocess.SubprocessError):
            return "none"
        files = [line[3:] for line in done.stdout.splitlines() if line.strip()] if done.returncode == 0 else []
        more = f" and {len(files) - SHOWN} more" if len(files) > SHOWN else ""
        return ", ".join(files[:SHOWN]) + more if files else "none"
