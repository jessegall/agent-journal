import os
import subprocess
import sys
from pathlib import Path

from journal.config import Config


class AgentLauncher:
    """Starts an agent for an environment from the running journal: its supervisor runs detached, with no journal of its own and no terminal, and its screen goes to a log under the runtime folder."""

    def __init__(self, config: Config) -> None:
        self.config = config

    def start(self, environment: str, agent: str) -> int:
        package = Path(__file__).resolve().parents[2]
        log = self.config.home / "runtime" / f"agent-{environment}.log"
        log.parent.mkdir(parents=True, exist_ok=True)
        port = self.config.port_file.read_text().strip() if self.config.port_file.is_file() else str(self.config.port)
        environ = {**os.environ, "JOURNAL_ROOT": str(self.config.root), "JOURNAL_PORT": port}
        with log.open("ab") as out:
            started = subprocess.Popen([sys.executable, str(package / "journal.py"), agent, "--env", environment, "--yes", "--no-open", "--no-journal"], cwd=self.config.root, env=environ, stdin=subprocess.DEVNULL, stdout=out, stderr=out, start_new_session=True)
        return started.pid
