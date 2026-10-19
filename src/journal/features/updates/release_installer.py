import os
import subprocess
import tempfile
from pathlib import Path
from urllib.request import urlopen

from journal.config import Config
from journal.features.updates.release import Release
from journal.refused import Refused

INSTALL_SCRIPT = "https://raw.githubusercontent.com/jessegall/agent-journal/{tag}/install.sh"
FETCH_SECONDS = 30
INSTALL_SECONDS = 600


class ReleaseInstaller:
    """A release's own install.sh run from the project root: it copies the release's source into .journal/src, runs journal setup and restarts the running journals on the new code."""

    def __init__(self, config: Config) -> None:
        self.config = config

    def run(self, release: Release) -> None:
        with tempfile.TemporaryDirectory(prefix="journal-install-") as folder:
            script = Path(folder) / "install.sh"
            try:
                with urlopen(INSTALL_SCRIPT.format(tag=release.tag), timeout=FETCH_SECONDS) as answer:
                    script.write_bytes(answer.read())
                ran = subprocess.run(["sh", str(script)], cwd=self.config.root, env={**os.environ, "AGENT_JOURNAL_REF": release.tag, "AGENT_JOURNAL_YES": "1"},
                                     capture_output=True, text=True, timeout=INSTALL_SECONDS)
            except (OSError, subprocess.TimeoutExpired) as error:
                raise Refused(f"the install of {release.version} could not run: {error}") from error
        if ran.returncode != 0:
            raise Refused(f"the install of {release.version} failed: {(ran.stderr or ran.stdout).strip()[-300:]}")
