import shlex
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path

from core.testing.story import Story
from tests.install.support import TIMEOUT_SECONDS, Scratch
from tests.install.test_release_archive import downloaded_script, release_with_archive
from tests.install.test_upgrade_script import version_four_project


@dataclass(frozen=True)
class ReleasedJournal:
    """A version 4 project and a downloaded release installer in isolated folders."""

    scratch: Scratch
    script: Path

    def expect_upgrade(self) -> None:
        finished = self.run(["sh", str(self.script), "upgrade", "--yes"])
        assert finished.returncode == 0, finished.stdout + finished.stderr

    def expect_command(self, line: str, text: str) -> None:
        command = self.scratch.journal / "src" / "core" / "journal.py"
        finished = self.run([sys.executable, str(command), *shlex.split(line)])
        assert finished.returncode == 0 and text in finished.stdout, finished.stdout + finished.stderr

    def run(self, arguments: list[str]) -> subprocess.CompletedProcess[str]:
        return subprocess.run(arguments, cwd=self.scratch.project, env=self.scratch.environment(), capture_output=True, text=True, timeout=TIMEOUT_SECONDS)


def prepare_release(story: Story) -> ReleasedJournal:
    folder = story.home.folder.parent / "release-upgrade"
    folder.mkdir()
    scratch = version_four_project(folder)
    release_with_archive(scratch)
    return ReleasedJournal(scratch, downloaded_script(scratch))
