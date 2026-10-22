import subprocess

from journal.config import Config

LINE_TIMEOUT_SECONDS = 30


class ProjectShell:
    """Runs a line of the user's in the project's own folder and hands back what it printed."""

    def __init__(self, config: Config) -> None:
        self.config = config

    def output(self, line: str) -> str:
        try:
            outcome = subprocess.run(line, shell=True, cwd=self.config.root, capture_output=True, text=True, timeout=LINE_TIMEOUT_SECONDS)
        except subprocess.TimeoutExpired:
            return f"{line} ran past {LINE_TIMEOUT_SECONDS} seconds and was stopped"
        return outcome.stdout + outcome.stderr
