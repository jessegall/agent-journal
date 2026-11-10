import hashlib
import os
import shutil
import subprocess
from pathlib import Path

from engine.journal.journal_home import JournalHome
from engine.errors.refusal import Refusal
from core.modules.plugins.support.plugin_releases import PluginReleases

CLONE_LIMIT_SECONDS = 120
STAGING_FOLDER = "plugin-staging"
EXCLUDED_NAMES = shutil.ignore_patterns(".git")


class PluginStaging:
    """Where a plugin's source is read from: a folder as it is, a repository cloned at its newest release into
    a folder of its own until the plugin is installed."""

    def __init__(self, home: JournalHome, releases: PluginReleases) -> None:
        self.home, self.releases = home, releases

    def folder(self, source: str) -> Path:
        if Path(source).is_dir():
            return Path(source)
        return self.home.folder / STAGING_FOLDER / hashlib.sha256(source.encode()).hexdigest()

    def fetched(self, source: str) -> Path:
        folder = self.folder(source)
        if Path(source).is_dir():
            return folder
        self.cleared(source)
        tag = self.releases.newest_tag(source)
        branch = ["--branch", tag] if tag else []
        command = ["git", "clone", "--quiet", "--depth", "1", *branch, self.releases.address(source), str(folder)]
        try:
            finished = subprocess.run(command, capture_output=True, text=True, timeout=CLONE_LIMIT_SECONDS, check=False, stdin=subprocess.DEVNULL, env={**os.environ, "GIT_TERMINAL_PROMPT": "0"})
        except subprocess.TimeoutExpired as timeout:
            raise Refusal(f"{source} took longer than {CLONE_LIMIT_SECONDS} seconds to clone", "try again") from timeout
        if finished.returncode != 0:
            raise Refusal(f"{source} could not be cloned", finished.stderr.strip())
        return folder

    def cleared(self, source: str) -> None:
        if not Path(source).is_dir():
            shutil.rmtree(self.folder(source), ignore_errors=True)
