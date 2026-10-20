import os
import subprocess
import tempfile
from pathlib import Path
from urllib.request import urlopen

from journal.config import Config
from journal.features.updates.support.release import Release
from journal.support.refused import Refused

INSTALL_SCRIPT = "https://raw.githubusercontent.com/jessegall/agent-journal/{tag}/install.sh"
FETCH_SECONDS = 30
INSTALL_SECONDS = 600


class ReleaseInstaller:
    """A release's own install.sh run from the project root: it copies the release's source into .journal/src, runs journal setup and restarts the running journals on the new code."""

    def __init__(self, config: Config) -> None:
        self.config = config
        self.log = config.home / "runtime" / "update.log"

    def run(self, release: Release) -> None:
        """What the install prints is written to the update log, kept until the next update, so an update that did not take can be read back after the restart."""
        self.log.parent.mkdir(parents=True, exist_ok=True)
        with tempfile.TemporaryDirectory(prefix="journal-install-") as folder, self.log.open("w") as log:
            script = Path(folder) / "install.sh"
            log.write(f"installing {release.version}\n")
            log.flush()
            try:
                with urlopen(INSTALL_SCRIPT.format(tag=release.tag), timeout=FETCH_SECONDS) as answer:
                    script.write_bytes(answer.read())
                ran = subprocess.run(["sh", str(script)], cwd=self.config.root, env={**os.environ, "AGENT_JOURNAL_REF": release.tag, "AGENT_JOURNAL_YES": "1"},
                                     stdout=log, stderr=subprocess.STDOUT, timeout=INSTALL_SECONDS)
            except (OSError, subprocess.TimeoutExpired) as error:
                log.write(f"the install could not run: {error}\n")
                raise Refused(f"the install of {release.version} could not run: {error}") from error
        if ran.returncode != 0:
            raise Refused(f"the install of {release.version} failed: {self.log.read_text(errors='replace').strip()[-300:]}")
