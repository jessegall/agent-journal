import os
import subprocess

from engine.journal.journal_home import JournalHome
from engine.errors.refusal import Refusal

REPLACEMENT_LIMIT_SECONDS = 12


class LauncherReplacement:
    """Asks the installed executable to replace the launcher while its existing terminals finish."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    def run(self) -> None:
        binary = self.home.folder / "bin" / "journal"
        if not binary.is_file() or not self.home.socket("launcher").exists():
            return
        try:
            answer = subprocess.run([str(binary), "launcher-replace"], env={**os.environ, "JOURNAL_HOME": str(self.home.folder)},
                                    capture_output=True, text=True, timeout=REPLACEMENT_LIMIT_SECONDS)
        except subprocess.TimeoutExpired as error:
            raise Refusal("the launcher update did not finish", "the existing terminals keep running") from error
        if answer.returncode:
            raise Refusal("the launcher update failed", answer.stderr.strip())
