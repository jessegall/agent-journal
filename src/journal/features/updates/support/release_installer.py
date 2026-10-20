import os
import re
import subprocess
import tempfile
from pathlib import Path
from urllib.request import urlopen

from journal.config import Config
from journal.support.refused import Refused

GITHUB = re.compile(r"^(?:https://github\.com/|git@github\.com:)(?P<owner>[^/]+)/(?P<repo>[^/]+?)(?:\.git)?/?$")
"""A GitHub address, whose install.sh is read raw at a ref."""
FETCH_SECONDS = 30
INSTALL_SECONDS = 600


class ReleaseInstaller:
    """A release's own install.sh run from the project root: it copies the release's source into .journal/src, runs journal setup and restarts the running journals on the new code."""

    def __init__(self, config: Config) -> None:
        self.config = config
        self.log = config.home / "runtime" / "update.log"

    def run(self, ref: str, repository: str) -> None:
        """The install.sh of the repository at the ref, a release's tag or a branch, run from the project root; what it prints is written to the update log, kept until the next update, so an update that did not take can be read back after the restart."""
        self.log.parent.mkdir(parents=True, exist_ok=True)
        with tempfile.TemporaryDirectory(prefix="journal-install-") as folder, self.log.open("w") as log:
            script = Path(folder) / "install.sh"
            log.write(f"installing {ref} of {repository}\n")
            log.flush()
            try:
                with urlopen(self.script_at(repository, ref), timeout=FETCH_SECONDS) as answer:
                    script.write_bytes(answer.read())
                ran = subprocess.run(["sh", str(script)], cwd=self.config.root, env={**os.environ, "AGENT_JOURNAL_REPO": repository, "AGENT_JOURNAL_REF": ref, "AGENT_JOURNAL_YES": "1"},
                                     stdout=log, stderr=subprocess.STDOUT, timeout=INSTALL_SECONDS)
            except (OSError, subprocess.TimeoutExpired) as error:
                log.write(f"the install could not run: {error}\n")
                raise Refused(f"the install of {ref} could not run: {error}") from error
        if ran.returncode != 0:
            raise Refused(f"the install of {ref} failed: {self.log.read_text(errors='replace').strip()[-300:]}")

    @staticmethod
    def script_at(repository: str, ref: str) -> str:
        """Where the repository's install.sh is read raw at the ref: GitHub serves it under raw.githubusercontent.com; any other address is refused, since the installer is fetched before git is asked."""
        found = GITHUB.match(repository)
        if found is None:
            raise Refused(f"the journal installs from GitHub only: {repository} is no GitHub address")
        return f"https://raw.githubusercontent.com/{found['owner']}/{found['repo']}/{ref}/install.sh"
